var mongoose = require('mongoose');

var SecurityQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('SecurityQuestionModel', SecurityQuestionSchema);