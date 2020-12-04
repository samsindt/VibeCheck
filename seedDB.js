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
        { 
            username: 'bobby',
            password: 'theRootPassword29',
            email: 'bobby@root.com',
            firstname: 'bob',
            lastname: 'dylan',
            security: {
                question: securityQuestions[0],
                answer: 'i dont have a mother.'
            },
        },
        { 
            username: 'tom12',
            password: '12345hello',
            email: 'tom@theempire.com',
            firstname: 'tom',
            lastname: 'tim',
            security: {
                question: securityQuestions[1],
                answer: 'pink.'
            },
        },
        { 
            username: 'jewels',
            password: 'diamond12',
            email: 'shinebright@likeaDiamond.com',
            firstname: 'ruby',
            lastname: 'red',
            security: {
                question: securityQuestions[1],
                answer: 'red.'
            },
        },
        { 
            username: 'jackandjill',
            password: 'theRoot21',
            email: 'jack@root.com',
            firstname: 'jill',
            lastname: 'jack',
            security: {
                question: securityQuestions[3],
                answer: 'the hill.'
            },
        },
        { 
            username: 'peterButnotSpiderman',
            password: 'notsp1derman',
            email: 'spidermanrocks@spidey.com',
            firstname: 'peter',
            lastname: 'parker',
            security: {
                question: securityQuestions[3],
                answer: 'vemon.'
            },
        }
        
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
            postedBy: users[3],
        },
        {
            text: 'What is your vibe for the next year?',
            postedBy: users[4],
        },
        {
            text: 'What was the vibe of the MJ concert?',
            postedBy: users[5],
        },
        {
            text: 'What vibe do you have about traveling?',
            postedBy: users[6],
        },
        {
            text: 'What vibe do you get about living on mars?',
            postedBy: users[1],
        },
        {
            text: 'What vibe do you think Genghis Khan was on?',
            postedBy: users[1],
        },
        
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
        },
        {
            text: 'Yes',
            inResponseTo: questions[2],
            agreedWithBy: [users[0], users[2]]
        },
        {
            text: 'Really a question?',
            inResponseTo: questions[2],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5], users[6], users[7]]
        },
        {
            text: 'Revolutionary',
            inResponseTo: questions[3],
            agreedWithBy: [users[0], users[2], users[3], users[4], users[5], users[1]]
        },
        {
            text: 'Dreadful',
            inResponseTo: questions[3],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5]]
        },
        {
            text: 'Dont know',
            inResponseTo: questions[3],
            agreedWithBy: [users[0], users[2], users[1], users[3]]
        },
        {
            text: 'Welp',
            inResponseTo: questions[3],
            agreedWithBy: [users[0], users[2], users[1], users[3], users[4], users[5], users[6]]
        },
        {
            text: 'It is what it is',
            inResponseTo: questions[3],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4]]
        },
        {
            text: 'Amazing',
            inResponseTo: questions[4],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5], users[6], users[7]]
        },
        {
            text: 'Wonderful',
            inResponseTo: questions[4],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4]]
        },
        {
            text: 'Okay',
            inResponseTo: questions[4],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5]]
        },
        {
            text: 'Ehh',
            inResponseTo: questions[4],
            agreedWithBy: [users[2]]
        },
        {
            text: 'Terrible',
            inResponseTo: questions[4],
            agreedWithBy: [users[0], users[1], users[2], users[3]]
        },
        {
            text: 'Terrifying',
            inResponseTo: questions[5],
            agreedWithBy: [users[0], users[1], users[2], users[3]]
        },
        {
            text: 'Exotic',
            inResponseTo: questions[5],
            agreedWithBy: [users[0], users[1]]
        },
        {
            text: 'Adventurious',
            inResponseTo: questions[5],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5], users[6], users[7]]
        },
        {
            text: 'Mysterious',
            inResponseTo: questions[5],
            agreedWithBy: [users[0], users[1], users[2]]
        },
        {
            text: 'You only live once',
            inResponseTo: questions[5],
            agreedWithBy: [users[0]]
        },
        {
            text: 'Lets go!!! blast off!',
            inResponseTo: questions[6],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5], users[6], users[7]]
        },
        {
            text: 'ecstatic',
            inResponseTo: questions[6],
            agreedWithBy: [users[0], users[1], users[2], users[3], users[4], users[5], users[6]]
        },
        {
            text: 'Scary',
            inResponseTo: questions[6],
            agreedWithBy: [users[0], users[1], users[2]]
        },
        {
            text: 'Mysterious',
            inResponseTo: questions[6],
            agreedWithBy: [users[0], users[1], users[2], users[3]]
        },
        {
            text: 'Why not?',
            inResponseTo: questions[6],
            agreedWithBy: [ users[0]]
        },
        {
            text: 'I own the world',
            inResponseTo: questions[7],
            agreedWithBy: [users[0], users[1], users[2]]
        },
        {
            text: 'ecstatic',
            inResponseTo: questions[7],
            agreedWithBy: [users[0]]
        },
        {
            text: 'Im a god',
            inResponseTo: questions[7],
            agreedWithBy: [users[0], users[1], users[2]]
        },
        {
            text: 'Mysterious',
            inResponseTo: questions[7],
            agreedWithBy: [users[0], users[1], users[2], users[3]]
        },
        {
            text: 'Lets go!',
            inResponseTo: questions[7],
            agreedWithBy: [ users[0]]
        },

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