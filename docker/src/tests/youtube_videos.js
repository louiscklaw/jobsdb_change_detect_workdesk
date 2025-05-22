const fetch = require('node-fetch');
const fs = require('fs');

fetch('http://localhost:13010/youtube_videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://www.youtube.com/@hkhoy/videos',
    wait_before_read_s: 10,
    replace_filter: ['\n', '^ +$', '^.*ago$', '^.*views$', '^.*Now playing$', '^\\d+:\\d+$', '^\\d+:\\d+:\\d+$'],
  }),
})
  .then(res => res.json())
  .then(body => console.log(body))
  .catch(err => console.log(err));
