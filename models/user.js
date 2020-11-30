var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
     username: {type: String, required: true, unique: true},
     password: {type: String, required: true},
     email: {
         type: String,
         required: true,
         // regex from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#Validation 
         match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        }, 
     firstname: {type: String, required: true}, 
     lastname: {type: String, required: true},
     security: {
         question: {type: mongoose.Schema.Types.ObjectId, ref: 'SecurityQuestion', required: true},
         answer: {type: String, required: true},
     },
     postedQuestions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
     postedAnswers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}]
});

UserSchema.pre('save', function(next) {
    const saltRoundCost = 10;
    this._doc.password = bcrypt.hashSync(this._doc.password, saltRoundCost);
    next();
});

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);