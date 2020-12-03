var express = require('express');
const { response } = require('../app');
var router = express.Router();
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');

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

router.get('/id/:id', function(req, res) {
  QuestionModel.findById(req.params.id, function(err, question) {
    if (err) {
      return res.sendStatus(500);
    } 

    if (!question) {
      return res.sendStatus(404);
    }

    res.render('poll', {id: question._id, text: question.title});
  });
});

module.exports = router;