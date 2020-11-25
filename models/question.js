var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    text: String,
    asnswers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}]
});

module.exports = mongoose.model('Question', QuestionSchema);