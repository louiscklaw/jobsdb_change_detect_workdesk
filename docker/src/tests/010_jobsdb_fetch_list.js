const fetch = require('node-fetch');
const fs = require('fs');

let replace_filter = ['\n', '^ +$', '^.*ago$', '^.*views$', '^.*Now playing$', '^\\d+:\\d+$', '^\\d+:\\d+:\\d+$'];

fetch('http://localhost:3000/jobsdb_fetch_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: `https://hk.jobsdb.com/validation-engineer-jobs`,
    wait_before_read_s: 10,
    replace_filter,
  }),
})
  .then(res => res.json())
  .then(body => console.log(JSON.stringify(body)))
  .catch(err => console.log(err));

for (let i = 1; i < 6; i++) {
  fetch('http://localhost:3000/jobsdb_fetch_list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `https://hk.jobsdb.com/validation-engineer-jobs?page=${i}`,
      wait_before_read_s: 10,
      replace_filter,
    }),
  })
    .then(res => res.json())
    .then(body => console.log(JSON.stringify(body)))
    .catch(err => console.log(err));
}
