var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
var Questions = require('../models/question');
var Answers = require('../models/answer');
var auth = require('../helpers/auth');
const { verifyJWTCookie } = require('../middleware/auth');

/* GET home page. */
router.get('/', function(req, res) {
  var i = 0;
  var popularQuestion;

  Questions.find({}, function(err, questions){
    if (err) {
      return res.status(422).json({success: false});
    }
    
    popularQuestion = getPopularQuestion (questions);
    
    if (questions){
      res.render('index', { title: 'VibeCheck', question: popularQuestion.text});
    }
  });
});

function getPopularQuestion (questions){
  var i = 0;
  var popularQuestion = questions[0];
 
  while (questions[i]){
    if (getCount (popularQuestion) > getCount (questions[i])){
      popularQuestion = questions[i];
    }
   ++i;
  }

  return popularQuestion;
}

var ansCount = 0;

function getCount (oneQuestion){
  var i = 0;
  var numAnswers = 0;
  var answers;
  var oneAnswer = new Answers();
  var twoAnswer;
 
  //grab the responses and reformat them to answers model
  answers = oneQuestion.responses;
  

 //while there are still answers in the array, keep counting the number of 
 //responses
  while (answers[i]){
    var numAnswers = 0;

    Answers.findById(answers[i], function (err, oneAnswer){
      numAnswers += oneAnswer.agreedWithBy.length;
    });
    ++i;
  }

  return numAnswers;
}

module.exports = router;
