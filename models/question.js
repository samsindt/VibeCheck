var mongoose = require('mongoose');
var random = require('mongoose-simple-random');

var QuestionSchema = new mongoose.Schema({
    text: {type: String, required:true},
    responses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

QuestionSchema.virtual('popularity').get(function() {
    var totalResponses = 0;

    for (answer of this.responses) {
        totalResponses += answer.responseCount;
    }

    return totalResponses;
});

QuestionSchema.plugin(random);

module.exports = mongoose.model('Question', QuestionSchema);