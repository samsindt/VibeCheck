var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.user.userId);
  res.render('index', { title: 'VibeCheck' });
});

module.exports = router;
