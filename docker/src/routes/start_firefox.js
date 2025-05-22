const express = require('express');
const router = express.Router();
const { initBrowser } = require('../utils/initBrowser');
const fetch = require('node-fetch');
let yt_monitor_data_dir = '/config';
const sleep = ms => new Promise(res => setTimeout(res, ms));
const sem = require('semaphore')(1);

router.post('/', async (req, res) => {
  const startTime = Date.now();
  const { body } = req;

  sem.take(async function () {
    let browser;
    let result, uniq_result;

    try {
      browser = await initBrowser({ chrome_data_dir: yt_monitor_data_dir });
      const page = (await browser.pages())[0];

      await page.goto('https://www.gmail.com');
      await sleep(9999 * 1000);

      await browser.close();
    } catch (error) {
      console.log({ error });
      res.status(500).send('An error occurred');
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
