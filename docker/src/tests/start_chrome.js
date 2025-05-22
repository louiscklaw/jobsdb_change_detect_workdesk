const fetch = require('node-fetch');

fetch('http://localhost:3000/start_chrome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://www.example.com' }),
})
  .then(res => res.text())
  .then(body => console.log(body))
  .catch(err => console.log(err));
