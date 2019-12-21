var express = require('express');
var router = express.Router();
var globalConfig = require('../config/config');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index');
});
module.exports = router;