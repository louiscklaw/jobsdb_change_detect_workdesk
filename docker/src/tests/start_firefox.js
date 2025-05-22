const fetch = require('node-fetch');

fetch('http://localhost:3000/start_firefox', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://www.youtube.com' }),
})
  .then(res => res.text())
  .then(body => console.log(body))
  .catch(err => console.log(err));
