const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth routes go here.');
});

module.exports = router;
