var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var SecurityQuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }
});

SecurityQuestionSchema.plugin(random);

module.exports = mongoose.model('SecurityQuestion', SecurityQuestionSchema);