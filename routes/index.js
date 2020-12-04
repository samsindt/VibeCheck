var express = require('express');
var router = express.Router();
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');

router.get('/', function(req, res) {
  QuestionModel.findOneRandom({}, {}, {populate: 'responses'}, function(err, question) {
    if (err) {
        console.error("Error: " + err.toString());
        res.sendStatus(500);
        return;
    }

    res.render('index', {title: 'VibeCheck',
                      totalVotes: question.numResponses,
                      question: question.text, 
                      pollId: question._id});
  });
});

module.exports = router;