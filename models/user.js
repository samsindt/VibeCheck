var mongoose = require('mongoose');

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
     squestions: [{
         prompt: String,
         answer: String,
     }], // it seems that you can't set a validator for type objects in an array, but ideally we would validate that there is at least one element in array
});

module.exports = mongoose.model('UserModel', UserSchema);