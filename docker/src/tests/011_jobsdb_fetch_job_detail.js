const fetch = require('node-fetch');
const fs = require('fs');

fetch('http://localhost:3000/jobsdb_fetch_job_detail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // NOTE: not used url, fetch one from db on request
    url: 'https://hk.jobsdb.com/validation-engineer-jobs',
    wait_before_read_s: 10,
    replace_filter: ['\n', '^ +$', '^.*ago$', '^.*views$', '^.*Now playing$', '^\\d+:\\d+$', '^\\d+:\\d+:\\d+$'],
  }),
})
  .then(res => res.json())
  .then(body => console.log(JSON.stringify(body)))
  .catch(err => console.log(err));
