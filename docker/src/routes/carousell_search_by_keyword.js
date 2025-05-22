const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');

let yt_monitor_data_dir = '/config';

const sem = require('semaphore')(1);

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function initStealthing(page) {
  try {
    await page.evaluate(() => {
      // Object.defineProperty(navigator, 'webdriver', {
      //   get: () => undefined,
      // });

      delete navigator.__proto__.webdriver;
    });
  } catch (error) {
    console.log('error during initStealthing');
    console.log(error);
    throw error;
  }
}

router.post('/', async (req, res) => {
  const { body } = req;

  const startTime = Date.now();

  global.sem.take(async function () {
    let browser;
    console.log({ t: req.body });

    const { url, replace_filter, wait_before_read_s } = body;
    let result, uniq_result, set1;
    try {
      browser = await initBrowser({ chrome_data_dir: yt_monitor_data_dir });

      const page = (await browser.pages())[0];
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.example.com',
      });

      await page.mouse.move(100, 200);
      await page.mouse.move(150, 250, { steps: 10 });
      await page.keyboard.type('Hello World', { delay: 100 });

      await initStealthing(page);

      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.resourceType() === 'image') {
          console.log('Blocking image request: ' + request.url());
          request.abort();
        } else {
          request.continue();
        }
      });
      //
      // ---
      //
      await page.goto(url);
      // await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10 * 1000 });
      await page.waitForTimeout(3 * 1000);

      await page.screenshot({ path: 'screenshot.png', type: 'png' });

      // const posts_with_spotlights = await page.$x('//a');
      //
      const posts_with_spotlights = await page.$x("//div[contains(p, 'Spotlight')]");

      for (let ii = 0; ii < posts_with_spotlights.length; ii++) {
        const post_text = await page.evaluate(
          el => el.parentElement.parentElement.parentElement.parentElement.textContent,
          posts_with_spotlights[ii],
        );

        if (post_text.search('louis_coding') > -1) {
          console.log('louis post, skipping');
        } else {
          await page.keyboard.down('Control');
          await posts_with_spotlights[ii].click();

          await page.waitForTimeout(3 * 1000);

          await page.keyboard.up('Control');
        }
      }

      const pages = await browser.pages();
      for (let p_i = 1; p_i < pages.length; p_i++) {
        let page = pages[p_i];
        await page.reload();
        await page.waitForTimeout(3 * 1000);
        await page.close();
      }
      await page.waitForTimeout(3 * 1000);

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
