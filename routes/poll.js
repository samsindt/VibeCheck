var express = require('express');
var config = require('../config.json');
const { response } = require('../app');
var UserModel = require('../models/user');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
const { db } = require('../models/user');
const user = require('../models/user');
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

router.get('/popular', function(req, res) {
  QuestionModel.find().populate('responses').exec(function(err, docs) {
    if (err) {
      console.error("Error finding all polls by popularity: " + err);
      return res.sendStatus(500);
    }

    let responsePayload = [];

    docs.sort((a, b) => b.popularity - a.popularity);

    docs.forEach(question => {
      responsePayload.push(
        {
          text: question.text,
          id: question._id,
          numResponses: question.popularity
        }
      );
    });

    // instead of sending json, responsePayload could be used to render a mustache page
    res.json(responsePayload);
  })
});

module.exports = router;
