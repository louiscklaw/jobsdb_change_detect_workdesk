const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('health check!');
});

module.exports = router;
