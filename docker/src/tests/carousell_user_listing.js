const fetch = require('node-fetch');
const fs = require('fs');

fetch('http://localhost:3000/carousell_search_by_keyword', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://www.carousell.com.hk/u/code_dog_/',
    wait_before_read_s: 10,
    replace_filter: ['\n', '^ +$', '^.*ago$', '^.*views$', '^.*Now playing$', '^\\d+:\\d+$', '^\\d+:\\d+:\\d+$'],
  }),
})
  .then(res => res.json())
  .then(body => console.log(JSON.stringify(body)))
  .catch(err => console.log(err));
