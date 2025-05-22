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

router.post('/', async (req, res) => {
  const { body } = req;

  const startTime = Date.now();

  global.sem.take(async function () {
    let browser;
    console.log({ t: req.body });

    const { url, replace_filter, wait_before_read_s } = body;
    let result, uniq_result;

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

      const result_raw = await page.evaluate(() => {
        let temp = [];

        let scrape_result = [];
        document.querySelectorAll('.item-grid-container a.gallery-item-card-container').forEach(card_ele => {
          let item_title = card_ele.querySelector('span.item-title').textContent.trim() || '';
          let publishers = card_ele.querySelector('div.publisher').textContent.trim() || '';
          let install_count = card_ele.querySelector('span.install-count').textContent.trim() || '';
          let description = card_ele.querySelector('div.description').textContent.trim() || '';

          scrape_result.push({ item_title, publishers, install_count, description });
        });

        return JSON.stringify(scrape_result);
      });
      const result_json = JSON.parse(result_raw);

      result = result_json
        .map((item, i) => `${i}: ${item.item_title},${item.publishers},${item.install_count},${item.description}`)
        .join('\n');

      uniq_result = Array.from(new Set(result_json));

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
