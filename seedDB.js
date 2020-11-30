var config = require('./config.json');
var SecurityQuestionModel = require('./models/security-question');
var UserModel = require('./models/user');
var QuestionModel = require('./models/question');
var AnswerModel = require('./models/answer');

console.log('Seeding database at ' + config.databaseUrl);

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

var securityQuestions = [];

async function seedSecurityQuestions() {
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

    questionsContent.forEach(content => {
        var newQuestion = new SecurityQuestionModel(content);
        newQuestion.save();
        securityQuestions.push(newQuestion);
    });
}

var users = [];

async function seedUsers() {
    var usersContent = [
        { 
            username: 'root',
            password: 'theRootPassword29',
            email: 'root_user@root.com',
            firstname: 'root',
            lastname: 'user',
            security: {
                question: securityQuestions[0],
                answer: 'i dont have a mother. im root'
            },
        } ,
        {
            username: 'Sinux',
            password: 'finland123',
            email: 'sinus@sinux.org',
            firstname: 'Sinus',
            lastname: 'Orville',
            security: {
                question: securityQuestions[1],
                answer: 'blue'
            }
        },
        {
            username: 'gkhan',
            password: 'steppek1ng',
            email: 'gkhan@mongolempire.org',
            firstname: 'Genghis',
            lastname: 'Khan',
            security: {
                question: securityQuestions[4],
                answer: 'horse'
            }
        },
    ];

    for (content of usersContent) {
        var newUser = new UserModel(content);
        await newUser.save();
        users.push(newUser);
    }
}

var questions = [];

async function seedQuestions() {
    var questionsContent = [
        {
            text: 'How was your day?',
            postedBy: users[0],
        },
        {
            text: 'How many boats do I need to invade Japan?',
            postedBy: users[2],
        },
        {
            text: 'Was this good year?',
            postedBy: users[1],
        }
    ];

    for (content of questionsContent) {
        var newQuestion = new QuestionModel(content);
        newQuestion.save();
        newQuestion.postedBy.postedQuestions.push(newQuestion);
        await newQuestion.postedBy.save();
        questions.push(newQuestion);
    }
}

var answers = [];

async function seedAnswers() {
    var answersContent = [
        {
            text: 'Good',
            inResponseTo: questions[0],
            agreedWithBy: [users[1]]
        },
        {
            text: 'Bad',
            inResponseTo: questions[0]
        },
        {
            text: '10-50',
            inResponseTo: questions[1]
        },
        {
            text: '50-100',
            inResponseTo: questions[1]
        },
        {
            text: '100-900',
            inResponseTo: questions[1],
            agreedWithBy: [users[0]]
        },
        {
            text: '900+',
            inResponseTo: questions[1],
            agreedWithBy: [users[1]]
        },
        {
            text: 'No',
            inResponseTo: questions[2],
            agreedWithBy: [users[0], users[2]]
        }
    ];

    for (content of answersContent) {
        var newAnswer = new AnswerModel(content);
        newAnswer.save();
        newAnswer.inResponseTo.responses.push(newAnswer);
        await newAnswer.inResponseTo.save();
        for (let user of newAnswer.agreedWithBy) {
            user.postedAnswers.push(newAnswer);
            await user.save();
        }
        answers.push();
    }
}

async function seedDB() {
    await seedSecurityQuestions();
    console.log("-- security questions seeded");
    await seedUsers();
    console.log("-- users seeded");
    await seedQuestions();
    console.log("-- questions seeded");
    await seedAnswers();
    console.log("-- answers seeded");
    console.log('Seeding complete :)');
    process.exit();
}

seedDB();