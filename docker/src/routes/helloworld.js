const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');

let yt_monitor_data_dir = '/share/chrome-user-data/yt_monitor';
const sem = require('semaphore')(1);

router.post('/', async (req, res) => {
  const { body } = req;

  const startTime = Date.now();

  sem.take(async function () {
    let browser;
    console.log({ t: req.body });

    const { url, replace_filter, wait_before_read_s } = body;
    let result, uniq_result, set1;
    try {
      browser = await initBrowser({ chrome_data_dir: yt_monitor_data_dir });
      const page = (await browser.pages())[0];

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
        let temp;
        let t = [];
        document
          .querySelectorAll('div.container')[3]
          .querySelectorAll('a')
          .forEach((x, i) => {
            if (i % 2 == 0) t.push(x.href);
          });
        // t = [document.querySelectorAll('div.container')[3].querySelectorAll('a')[0].href];

        return JSON.stringify(t);
      });
      result = JSON.parse(result);

      // data cleaning
      result = result.map(item => item.trim());

      result = result.filter(item => item.search('videos') > -1);

      // for (let i = 0; i < replace_filter.length; i++) {
      //   let regex_filter_setting = replace_filter[i];
      //   result = result.map(item => item.replace(new RegExp(regex_filter_setting, 'g'), ''));
      // }

      result = result.filter(item => item !== '');
      result = result.sort();

      uniq_result = Array.from(new Set(result));

      await browser.close();
    } catch (error) {
      console.error({ error });
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
      sem.leave();
    }
  });
});

module.exports = router;
