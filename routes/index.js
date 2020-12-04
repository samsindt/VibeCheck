var express = require('express');
var router = express.Router();
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');

router.get('/', function(req, res) {
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
    
    QuestionModel.findById(responsePayload[0].id, function (err, questionTitle) {
      AnswerModel.findById(questionTitle.responses[0], function (err, answer){
        AnswerModel.find({inResponseTo: answer.inResponseTo}).populate(
                          'agreedWithBy').exec(function(err, docs) {
          var poll = {docs: []};
          var i = 0;

          if (err) {
            console.error("Error finding all polls by popularity: " + err);
            return res.sendStatus(500);
          }
          while (docs[i]){
            poll.docs.push({
              text: docs[i].text,
              numVotes: docs[i].agreedWithBy.length
            });
            ++i;
          }

          res.render('index', {title: 'VibeCheck',
                      totalVotes: responsePayload[0].numResponses,
                      question: responsePayload[0].text, 
                      pollData: poll.docs,
                      pollId: responsePayload[0].id});
        });
      });
    });
  });
});

module.exports = router;