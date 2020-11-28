var config = require('./config.json');
var SecurityQuestionModel = require('./models/security-question');
console.log('Populating SecurityQuestions collection at ' + config.databaseUrl);

var mongoose = require('mongoose');
mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
},
err => {if (err) throw err});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var questions = [
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

SecurityQuestionModel.insertMany(questions, function(err) {
    if (err) {
        console.error('Error: ' + err.toString());
    }

    process.exit();
});