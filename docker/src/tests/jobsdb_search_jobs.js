const fetch = require('node-fetch');
const fs = require('fs');

fetch('http://localhost:13010/jobsdb_search_jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://hk.jobsdb.com/validation-engineer-jobs',
    wait_before_read_s: 10,
    replace_filter: ['\n', '^ +$', '^.*ago$', '^.*views$', '^.*Now playing$', '^\\d+:\\d+$', '^\\d+:\\d+:\\d+$'],
  }),
})
  .then(res => res.json())
  .then(body => console.log(JSON.stringify(body, null, 2)))
  .catch(err => console.log(err));
