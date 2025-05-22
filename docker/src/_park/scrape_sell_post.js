'use strict';
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('https://pocketbase.iamon99.com');

const { initBrowser } = require('../utils/initBrowser');
const _ = require('underscore');

const SCRIPT_FILENAME = 'scrape_sell_post';
console.log('start chrome js');

let python_help_hk = '/share/chrome-user-data/scrape_sell_post';

(async () => {
  let browser, page;
  try {
    browser = await initBrowser({ chrome_data_dir: python_help_hk });
    page = (await browser.pages())[0];

    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        // console.log("Blocking image request: " + request.url());
        request.abort();
      } else {
        request.continue();
      }
    });

    let keywords = _.shuffle([
      'dell',
      'thinkpad',
      'monitor',
      'macbook',
      'ipad',
      'macbookpro',
      'macmini',
      'mac-mini',
      'android',
      '小米',
      'redmi',
      'nas',
      'coding',
      'itx',
      'nuc',
      'xiaomi',
      'macbookpro%2032g',
      'mac%20studio',
    ]);
    let keyword_length = keywords.length;

    for (var j = 0; j < keyword_length; j++) {
      let keyword = keywords[j];
      console.log(`${SCRIPT_FILENAME} routine check for ${keyword}`);

      await page.goto(
        `https://www.carousell.com.hk/search/${keywords[j]}?sort_by=3&t-search_query_source=direct_search`,
      );
      // await page.type("#root  input", keyword, 5);
      // await page.keyboard.press("Enter");
      // await page.waitForNavigation({ timeout: 30 * 1000 });

      // sell post found
      const sell_posts_result = await page.evaluate(() => {
        let users = [];
        let post_ages = [];
        let titles = [];
        let prices = [];
        let conditions = [];
        let post_links = [];
        let seller_links = [];
        let post_ids = [];

        document.querySelectorAll('div.asm-browse-listings > div > div > div').forEach(p => {
          if (p.id.search('native-ad') > -1) {
          } else if (p.querySelectorAll('a p')[2]?.textContent.search('Consumption Voucher') > -1) {
          } else {
            if (p.querySelectorAll('a p')[4]?.textContent != undefined) {
              users.push(p.querySelectorAll('a p')[0]?.textContent);
              post_ages.push(p.querySelectorAll('a p')[1]?.textContent);
              titles.push(p.querySelectorAll('a p')[2]?.textContent);
              prices.push(p.querySelectorAll('a p')[3]?.textContent.replace(',', ''));
              conditions.push(p.querySelectorAll('a p')[4]?.textContent);
              seller_links.push(p.querySelectorAll('a')[0]?.href);
              post_links.push(p.querySelectorAll('a')[1]?.href);
              post_ids.push(p.querySelectorAll('div div')[0].getAttribute('data-testid').split('-')[2]);
              // console.log(p.querySelectorAll("a")[1]?.href);
            }
          }
        });

        return JSON.stringify({
          users,
          post_ages,
          titles,
          prices,
          conditions,
          post_links,
          seller_links,
          post_ids,
        });
      });

      const sell_posts = JSON.parse(sell_posts_result);
      let { users, post_ages, titles, prices, conditions, post_links, seller_links, post_ids } = sell_posts;

      for (let i = 0; i < post_ages.length; i++) {
        let post_age = post_ages[i];
        let price = prices[i];

        try {
          if (post_age.search('minutes') > -1 || post_age.search('seconds') > -1) {
            let int_minute = parseInt(post_age.split('minutes')[0]);
            let int_price = parseInt(price.split('$')[1]);

            const data = {
              post_id: post_ids[i],
              title: titles[i],
              price: int_price,
              description: '',
              condition: conditions[i],
              post_link: post_links[i],
              seller_link: seller_links[i],
              currency: parseInt(price.split('$')[0] + '$'),
              status: 'selling',
            };

            try {
              const post_found = await pb
                .collection('carousell_sell_posts')
                .getFirstListItem(`post_id="${post_ids[i]}"`, {});

              console.log(`post_found, skip add post to db`);
            } catch (error) {
              console.log('post not found in db, adding post');
              const record = await pb.collection('carousell_sell_posts').create(data);
            }
          }
        } catch (error) {
          console.log('error found during getting sell post');
          console.log(post_age);
          console.log(price);
        }
      }
    }

    console.log(`${SCRIPT_FILENAME}: script end with clear`);
  } catch (error) {
    console.log(error);
    // await page.waitForTimeout(9999 * 1000);
    await page.screenshot({
      path: '/share/error_screenshot.png',
      fullPage: true,
    });
  }
  browser ? await browser.close() : null;
})();
