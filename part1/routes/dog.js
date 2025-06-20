var express = require('express');
var router = express.Router();
var db = require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dogs', async function())

module.exports = router;