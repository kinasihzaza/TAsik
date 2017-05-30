var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  a =  0x9e3779b9 >>>  2 & 3;
  console.log(a);
  res.json('respond with a resource');
});
module.exports = router;
