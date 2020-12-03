var express = require('express');
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

module.exports = router;