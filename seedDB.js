var config = require('./config.json');
var SecurityQuestionModel = require('./models/security-question');
var UserModel = require('../models/user');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
console.log('Populating SecurityQuestions collection at ' + config.databaseUrl);

var mongoose = require('mongoose');
const securityQuestion = require('./models/security-question');
mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
},
err => {if (err) throw err});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var securityQuestions;

function seedSecurityQuestions() {
    var questionsContent = [
        {
            text: "What is your mother's maiden name?"
        },
        {
            text: "What is your favorite color?"
        },
        {
            text: "What is the name of your favorite teacher?"
        },
        {
            text: "Who is your best friend?"
        },
        {
            text: "What is the name of your first pet?"
        },
        {
            text: "What is your favorite fruit?"
        },
        {
            text: "What is your least favorite food?"
        },
        {
            text: "What color was your first car?"
        },
        {
            text: "What is your favorite breakfast food?"
        }
    ];

    questionsContent.map(content => {
        var newQuestion = new SecurityQuestionModel(content);
        newQuestion.save();
        securityQuestions.push(newQuestion);
    });
}

var users;

function seedUsers() {
    var usersContent = [
        { 
            plain: {
                username: 'root',
                email: 'root_user@root.com',
                firstname: 'root',
                lastname: 'user',
                security: {
                    question: securityQuestions[0],
                    answer: 'i dont have a mother. im root'
                },
            password: 'theRootPassword29',

        },
    } ,
        {
            username: 'Sinux',
            email: 'sinus@sinux.org',
            firstname: 'Sinus',
            lastname: 'Orville',
            security: {
                question: securityQuestion[1],
                answer: 'blue'
            }
        },
        {
            username: 'gkhan',
            email: 'gkhan@mongolempire.org',
            firstname: 'Genghis',
            lastname: 'Khan',
            security: {
                question: securityQuestion[4],
                answer: 'horse'
            }
        },
    ];

    usersContent.map(content => {
        var newUser = new UserModel(content);
        newUser.setPass
    });
}


/*SecurityQuestionModel.insertMany(questions, function(err) {
    if (err) {
        console.error('Error: ' + err.toString());
    }

    process.exit();
});*/