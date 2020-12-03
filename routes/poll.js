var express = require('express');
var config = require('../config.json');
var UserModel = require('../models/user');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
const { db } = require('../models/user');
const user = require('../models/user');
//const user = require('../models/user');
var router = express.Router();


/* GET create page. */
router.get('/create', function(req, res) {
  res.render('createPoll', { title: 'VibeCheck' });
});

router.post('/create', function(req, res) {
  var newQuestion= new QuestionModel();
  user.findOne({username: req.user.username}, function(err, user) {
    if (err) {
        console.error("Error: " + err.toString());
        res.sendStatus(500);
        return;
    }

    newQuestion.postedBy = user._id;
    newQuestion.text = req.body.question;


  var answers = [];

  async function insertAnswers() {
  var responses = [
    {text: req.body.choice1,
      inResponseTo: newQuestion
    }, 
    {text: req.body.choice2,
      inResponseTo: newQuestion
    },
    {text: req.body.choice3,
      inResponseTo: newQuestion
    }, 
    {text: req.body.choice4,
      inResponseTo: newQuestion
    }, 
    {text: req.body.choice5,
      inResponseTo: newQuestion
    }, 
  ];
  

  for (response of responses) {
    var newAnswer = new AnswerModel(response);
    newAnswer.save();
    newAnswer.inResponseTo.responses.push(newAnswer);
    await newAnswer.inResponseTo.save();
    answers.push();
    }
  }
  insertAnswers();

  newQuestion.save(function(err) {
    if (err) {
      return res.json({ success: false, error: err}); // probably should redirect to dedicated error page.
    }
  res.json({ success: true});
  });
});
  
  
});


module.exports = router;
