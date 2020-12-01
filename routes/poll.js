var express = require('express');
var config = require('../config.json');
var UserModel = require('../models/user');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
var router = express.Router();


/* GET create page. */
router.get('/create-poll', function(req, res) {
  res.render('createPoll', { title: 'VibeCheck' });
});

router.post('/create-poll', function(req, res) {
  var newQuestion= new QuestionModel();
  
  console.log(req.body.question);
  console.log(req.body.choice1);
  console.log(req.body.choice2);
  console.log(req.body.choice3);
  console.log(req.body.choice4);
  console.log(req.body.choice5);
  console.log(newQuestion.text);
  console.log(req.user.username);
  //mongoose.Types.ObjectId(req.user.userId)
  newQuestion.text = req.body.question;
  newQuestion.postedBy = "5fc581f2131e949d944b5a81";

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
          
      res.status(422);
      return res.json({ success: false, error: err}); // probably should redirect to dedicated error page.
    }
  res.json({ success: true});
  });

  console.log('end of poll.js');
});


module.exports = router;
