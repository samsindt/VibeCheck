var express = require('express');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
var UserModel = require('../models/user');
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
      return res.json({ success: false, error: err}); 
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

    let questions = [];

    docs.sort((a, b) => b.popularity - a.popularity);

    docs.forEach(question => {
      questions.push(
        {
          text: question.text,
          id: question._id,
        }
      );
    });

    res.render('chartList', {title: 'Popular Charts', charts: questions});
  })
});

router.get('/your-questions', function(req, res) {
  UserModel.findById(req.user.userId).populate('postedQuestions').exec(function(err, user) {
    if (hasErrorIdError(res, err, user)) return; 

    var charts = user.postedQuestions.map(q => {
      return {text: q.text, id: q._id};
    })

    res.render('chartList', {title: 'Your Questions', charts: charts});
  })
});

router.get('/your-answers', function(req, res) {
  UserModel.findById(req.user.userId).populate({path:'postedAnswers', populate: {path: 'inResponseTo'}}).exec(function(err, user) {
    if (hasErrorIdError(res, err, user)) return; 

    var charts = user.postedAnswers.map(a => {
      console.log(a.inResponseTo);
      return {text: a.inResponseTo.text, id: a.inResponseTo._id}
    });

    res.render('chartList', {title: 'Your Answers', charts: charts});
  });
})

router.get('/id/:id', function(req, res) {
  QuestionModel.findById(req.params.id).populate('responses').exec(function(err, question) {
    
    if (hasErrorIdError(res, err, question)) return; 

    var responses = question.responses.map(r => {return {text: r.text, id: r._id}; });

    res.render('poll', {title: question.text, responses: responses, pollId: req.params.id});
  });
});

router.get('/populate/:id', function(req, res) {
  QuestionModel.findById(req.params.id).populate('responses').exec(function(err, question) {
    if (hasErrorIdError(res, err, question)) return; 

    var labels = question.responses.map(r => r.text);
    var counts = question.responses.map(r => r.responseCount);

    res.json({labels: labels, counts: counts});
  });
});

router.post('/vote', function(req, res) {
    AnswerModel.findById(req.body.vote, function(err, answer) {

      if (hasErrorIdError(res, err, answer)) return; 

      UserModel.findById(req.user.userId, function(err, user) {

        if (hasErrorIdError(res, err, user)) return; 

        answer.agreedWithBy.push(user);
        answer.save(function(err) {
          if (err) {
            console.error(err.toString());
            return res.sendStatus(500);
          }

          user.postedAnswers.push(answer);
          user.save(function(err) {
            if (err) {
              console.error(err.toString());
              return res.sendStatus(500);
            }

            res.status(200).end();
          });
        });
      });
    });
});

function hasErrorIdError(res, err, doc) {
  if ((err && err.name === 'CastError') || !doc) {
    res.sendStatus(404);
    return true;
  } 

  if (err) {
    console.error(err.toString());
    res.sendStatus(500);
    return true;
  }

  return false;
}

module.exports = router;
