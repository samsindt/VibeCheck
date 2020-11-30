var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    text: {type: String, required: true},
    inResponseTo: {type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true},
    agreedWithBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

AnswerSchema.methods.getNumAgreements = function(password) {
    return this.agreedWithBy.length;
};

module.exports = mongoose.model('Answer', AnswerSchema);