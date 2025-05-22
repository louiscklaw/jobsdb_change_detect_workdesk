const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');
let yt_monitor_data_dir = '/share/chrome-user-data/yt_monitor';
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

router.get('/', async (req, res) => {
  res.redirect('http://www.example.com');
  return;
});

router.post('/', async (req, res) => {
  const { body } = req;

  const startTime = Date.now();

  global.sem.take(async function () {
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

      const page = (await browser.pages())[0];
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

      // result = await page.evaluate(() => {
      //   let temp = [];
      //   document
      //     .querySelectorAll('section')[2]
      //     .querySelectorAll('div')[2]
      //     .querySelectorAll('div[data-testid^=listing-card]')
      //     .forEach(e => {
      //       let ele = e.querySelectorAll('p')[2];
      //       temp.push(ele.textContent);
      //     });
      //   return JSON.stringify(temp);
      // });
      // result = JSON.parse(result);

      // // data cleaning
      // result = result.map(item => item.trim());

      // for (let i = 0; i < replace_filter.length; i++) {
      //   let regex_filter_setting = replace_filter[i];
      //   result = result.map(item => item.replace(new RegExp(regex_filter_setting, 'g'), ''));
      // }

      // //
      // result = result.filter(item => item !== '');
      // result = result.sort();

      // uniq_result = Array.from(new Set(result));

      await browser.close();
    } catch (error) {
      console.log({ error });
    } finally {
      browser ? await browser.close() : null;
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000;
      res.send({
        status: 'done',
        results: { result, uniq_result },
        request_body: body,
        time_spent_sec: timeSpent,
      });
      global.sem.leave();
    }
  });
});

module.exports = router;
