  var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    text: {type: String, required:true},
    responses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Question', QuestionSchema);