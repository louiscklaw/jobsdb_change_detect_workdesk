const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');
var TurndownService = require('turndown');

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
      var turndownService = new TurndownService();

      // status="FETCHED"
      const job_to_get_detail = await pb
        .collection('002_job_list')
        .getFirstListItem('jobLink="https://hk.jobsdb.com/job/83754168"', {});

      try {
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

        // https://hk.jobsdb.com/job/84273836
        // await page.goto(job_to_get_detail.jobLink);
        await page.goto(job_to_get_detail.jobLink);

        // await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10 * 1000 });
        await page.waitForTimeout(parseInt(wait_before_read_s) * 1000);
        await page.screenshot({ path: 'screenshot.png', type: 'png' });

        result = await page.evaluate(() => {
          const eleJobAdDetails = document.querySelector('[data-automation="jobAdDetails"]');
          const jobAdDetails = eleJobAdDetails ? eleJobAdDetails.outerHTML : 'not found';

          // data-automation="job-detail-title"
          const eleJobDetailTitle = document.querySelector('[data-automation="job-detail-title"]');
          const jobDetailTitle = eleJobDetailTitle ? eleJobDetailTitle.outerHTML : 'not found';

          // data-automation="job-detail-location"
          const eleJobDetailLocation = document.querySelector('[data-automation="job-detail-location"]');
          const jobDetailLocation = eleJobDetailLocation ? eleJobDetailLocation.outerHTML : 'not found';

          // data-automation="job-detail-classifications"
          const eleJobDetailClassifications = document.querySelector('[data-automation="job-detail-classifications"]');
          const jobDetailClassifications = eleJobDetailClassifications
            ? eleJobDetailClassifications.outerHTML
            : 'not found';

          // data-automation="job-detail-work-type"
          const eleJobDetailWorkType = document.querySelector('[data-automation="job-detail-work-type"]');
          const jobDetailWorkType = eleJobDetailWorkType ? eleJobDetailWorkType.outerHTML : 'not found';

          //  data-automation="advertiser-name
          const eleAdvertiserName = document.querySelector('[data-automation="advertiser-name"]');
          const advertiserName = eleAdvertiserName ? eleAdvertiserName.outerHTML : 'not found';

          return JSON.stringify({
            jobAdDetails,
            jobDetailTitle,
            advertiserName,
            jobDetailLocation,
            jobDetailClassifications,
            jobDetailWorkType,
          });
        });

        let resultJson = JSON.parse(result);

        await browser.close();

        const jobAdDetails_MD = turndownService.turndown(resultJson.jobAdDetails);
        const jobDetailTitle_MD = turndownService.turndown(resultJson.jobDetailTitle);
        const advertiserName_MD = turndownService.turndown(resultJson.advertiserName);
        const jobDetailLocation_MD = turndownService.turndown(resultJson.jobDetailLocation);
        const jobDetailClassifications_MD = turndownService.turndown(resultJson.jobDetailClassifications);
        const jobDetailWorkType_MD = turndownService.turndown(resultJson.jobDetailWorkType);

        const record = await pb
          .collection('002_job_list')
          .getFirstListItem(`jobLink="${job_to_get_detail.jobLink}"`, {});

        console.log({ record, t1: resultJson.jobAdDetails, t2: jobAdDetails_MD });

        await pb.collection('002_job_list').update(record.id, {
          status: 'JOB_DETAIL_GET',
          jobAdDetails_HTML: resultJson.jobAdDetails,
          jobAdDetails_MD,
          jobDetailTitle_HTML: resultJson.jobDetailTitle,
          jobDetailTitle_MD,
          advertiserName_HTML: resultJson.advertiserName,
          advertiserName_MD,
          jobDetailLocation_HTML: resultJson.jobDetailLocation,
          jobDetailLocation_MD,
          jobDetailClassifications_HTML: resultJson.jobDetailClassifications,
          jobDetailClassifications_MD,
          jobDetailWorkType_HTML: resultJson.jobDetailWorkType,
          jobDetailWorkType_MD,
          error: { result: 'clear exit' },
        });
      } catch (error) {
        let record = await pb.collection('002_job_list').getFirstListItem(`jobLink="${job_to_get_detail.jobLink}"`, {});
        await pb.collection('002_job_list').update(record.id, {
          status: 'JOB_DETAIL_FETCH_ERROR',
          error,
        });
        console.error(error);
        console.log('fetch job detail error');
      }
    } catch (error) {
      if (error.response.message == "The requested resource wasn't found.") {
        console.error('no record match filter');
      } else {
        console.error(error);
      }
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
