require('dotenv').config();
var { FIREFOX_DATA_DIR, CHROME_DATA_DIR } = process.env;
const { SRC_ROOT, UTILS_ROOT, WORKER_ROOT } = require('../config');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');

const assert = require('chai').assert;

const puppeteer = require('puppeteer-extra');

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    blockTrackers: true,
  }),
);

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

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

async function initBrowser({ chrome_data_dir }) {
  try {
    var browser = await puppeteer.launch({
      product: 'chrome',
      headless: false,
      executablePath: '/usr/bin/google-chrome',
      userDataDir: '/config',
      // slowMo: 1,
      // NOTE: https://wiki.mozilla.org/Firefox/CommandLineOptions
      // defaultViewport: { width: 1024, height: 768 * 20 },
      ignoreHTTPSErrors: true,
      // args: [`--user-data-dir="${chrome_data_dir}"`],
      // args: ['--no-sandbox'],
    });

    const page = (await browser.pages())[0];
    await initStealthing(page);

    return browser;
  } catch (error) {
    console.log('error during initBrowser');
    console.log(error);
    throw error;
  }
}

function helloworldBrowser() {
  console.log('helloworld');
}

module.exports = {
  initBrowser,
  helloworldBrowser,
};
