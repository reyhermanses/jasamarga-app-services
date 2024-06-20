var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome to Aggregator Cron Version 1.2.0' });
});

module.exports = router;
