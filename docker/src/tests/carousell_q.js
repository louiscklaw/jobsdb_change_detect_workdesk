const fetch = require('node-fetch');
const fs = require('fs');

// fetch('http://192.168.10.21:13010/carousell_q?kw=coding', {
//   method: 'GET',
// })
//   .then(res => res.json())
//   .then(body => console.log(JSON.stringify(body)))
//   .catch(err => console.log(err));

fetch('http://localhost:3000/carousell_q?kw=coding', {
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
