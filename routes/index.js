var express = require('express');
var router = express.Router();
let Poll = require('./../models/poll');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'VibeCheck' });
});

module.exports = router;
