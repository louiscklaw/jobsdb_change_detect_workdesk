const { initBrowser } = require('../utils/initBrowser');

let yt_monitor_data_dir = '/share/chrome-user-data/yt_monitor';

console.log('start chrome js');

(async () => {
  let browser;
  try {
    browser = await initBrowser({ chrome_data_dir: yt_monitor_data_dir });
    const page = (await browser.pages())[0];
    await page.goto('https://example.com');

    const posts = await page.$$('h1');

    // Extract the text content of the selected element
    await posts.forEach(async post => {
      const textContent = await post.evaluate(element => element.textContent, posts);
      if (textContent.toLowerCase().indexOf('louis_coding') != -1) {
        if (textContent.toLowerCase().indexOf('spotlight') > -1) {
          await post.click({ button: 'right' });
          await page.waitForNavigation({
            timeout: 30 * 1000,
            waitUntil: 'networkidle0',
          });
        }
      }
    });

    // wait for search result
    // await page.waitForTimeout(5 * 1000);
    // input box
    // #root > div > div > header > div.D_Qx.M_Gx > div > div > div > div.D_arY > div > div > div > input

    // console.log("start count");
    // const elements = await page.locator("body").count();

    // console.log({ elements });
    // await elements.forEach(async (ele) => {
    //   console.log(ele.textContent());
    // });

    // await page.evaluate(() => {
    //   let posts = document.querySelectorAll("");

    //   posts.forEach((post) => {
    //     let text_content = post.textContent.toLowerCase();
    //     // skip if found
    //     if (text_content.indexOf("louiscklaw") == -1) {
    //       if (text_content.indexOf("spotlight") > -1) {
    //         post.click();
    //       }
    //     }
    //   });
    // });

    await page.waitForTimeout(1 * 1000);

    await browser.close();
  } catch (error) {
    console.log(error);
    browser ? await browser.close() : null;
  }
})();
