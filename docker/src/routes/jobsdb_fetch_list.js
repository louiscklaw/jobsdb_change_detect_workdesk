const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');

let yt_monitor_data_dir = '/chrome_data_dir/yt_monitor';

const sem = require('semaphore')(1);
const puppeteer = require('puppeteer-extra');

// https://github.com/pocketbase/js-sdk
const PocketBase = require('pocketbase/cjs');

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
    let result, uniq_result, set1;
    try {
      const pb = new PocketBase('http://pocketbase:8090');

      browser = await initBrowser({ chrome_data_dir: yt_monitor_data_dir });

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

      result = await page.evaluate(() => {
        let temp = [];

        for (let i = 0; i < 999; i += 2) {
          let ele = document.querySelectorAll('[data-testid^=job-card]')[i];

          if (ele) {
            let ele_a = ele.querySelector('a');
            let ele_title = ele.querySelectorAll('[data-automation="jobTitle"]')[0].textContent;

            // https://hk.jobsdb.com/job/84263074?type=standard&ref=search-standalone&origin=cardTitle#sol=049abbb35d6869d0651097552f00d2c6e52c02bf
            let ele_id = ele_a.getAttribute('href').split('?')[0].split('/')[2];
            temp.push({
              jobTitle: ele_title,
              // https://hk.jobsdb.com/job/84048596
              jobId: ele_id,
              jobLink: `https://hk.jobsdb.com/job/${ele_id}`,
            });
          } else {
            break;
          }
        }
        return JSON.stringify(temp);
      });

      let resultJson = JSON.parse(result);

      await browser.close();

      for (let i = 0; i < resultJson.length; i++) {
        try {
          await pb.collection('002_job_list').getFirstListItem(
            `jobId="${resultJson[i].jobId}"`,
            {},
            //
          );
        } catch (error) {
          await pb.collection('002_job_list').create({ ...resultJson[i], status: 'FETCHED' });
        }
      }
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
