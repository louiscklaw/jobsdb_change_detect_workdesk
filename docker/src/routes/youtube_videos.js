const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');
let yt_monitor_data_dir = '/share/chrome-user-data/yt_monitor';
// const sem = require('semaphore')(1);
const puppeteer = require('puppeteer-extra');

async function initStealthing(page) {
  try {
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
  } catch (error) {
    console.log('error during initStealthing');
    console.log(error);
    throw error;
  }
}

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

router.post('/', async (req, res) => {
  global.sem.take(async () => {
    try {
      await fetch('http://healthcheck.iamon99.com/ping/fb732e07-8e5b-4704-8360-9b84986eaf70', {
        method: 'GET',
      });
    } catch (error) {
      console.log('error sending healthcheck ping request');
      console.log(error);
    }

    const { body } = req;

    const startTime = Date.now();

    let browser;
    console.log({ t: req.body });

    const { url, replace_filter, wait_before_read_s } = body;
    let result, uniq_result, set1;
    try {
      browser = await puppeteer.launch({
        product: 'chrome',
        headless: false,
        executablePath: '/usr/bin/google-chrome-stable',
        userDataDir: yt_monitor_data_dir,
        //   slowMo: 1,
        // NOTE: https://wiki.mozilla.org/Firefox/CommandLineOptions
        defaultViewport: { width: 1024, height: 768 },
        ignoreHTTPSErrors: true,
        // args: [`--user-data-dir="${chrome_data_dir}"`],
      });

      // const page = (await browser.pages())[0];
      const page = await browser.newPage();
      await initStealthing(page);

      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.resourceType() === 'image') {
          // console.log("Blocking image request: " + request.url());
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.goto(url);
      // await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10 * 1000 });
      await page.waitForTimeout(parseInt(wait_before_read_s) * 1000);

      await page.screenshot({ path: 'screenshot.png', type: 'png' });

      result = await page.evaluate(q => {
        let temp = '';
        document.querySelectorAll(q).forEach(e => {
          temp += e.textContent;
        });
        return temp;
      }, '#contents');
      result = result.split('\n');

      // data cleaning
      result = result.map(item => item.trim());

      for (let i = 0; i < replace_filter.length; i++) {
        let regex_filter_setting = replace_filter[i];
        result = result.map(item => item.replace(new RegExp(regex_filter_setting, 'g'), ''));
      }

      //
      result = result.filter(item => item !== '');
      result = result.sort();

      uniq_result = Array.from(new Set(result));

      console.log({ result });

      await browser.close();
    } catch (error) {
      console.log({ error });
    } finally {
      browser ? await browser.close() : null;
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000;

      global.sem.leave();

      res.send({
        status: 'done',
        results: { result, uniq_result },
        request_body: body,
        time_spent_sec: timeSpent,
      });
    }
  });
});

module.exports = router;
