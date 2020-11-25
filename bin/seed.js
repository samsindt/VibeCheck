require('mongoose').connect('mongodb://127.0.0.1:27017/vibeCheckDB');

const topics = [
    "How do you feel about lockdown?",
    "How do you feel today?",
    "How does chocolate ice cream sound?",
    "Should cars have four wheels?",
    "How good is sushi?"
];
let Poll = require('../models/poll');

// empty the collection first
Poll.remove({})
    .then(() => {
        let polls = [];
        for (let i = 0; i < 5; i++) {
            polls.push({
                topic: topics[i],
                choices: [
                    {
                        value: "Very Good",
                        votes: Math.round(Math.random() * 20)
                    },
                    {
                        value: "Good",
                        votes: Math.round(Math.random() * 20)
                    },
                    {
                        value: "Ehh",
                        votes: Math.round(Math.random() * 20)
                    },
                    {
                        value: "Bad",
                        votes: Math.round(Math.random() * 20)
                    },
                    {
                        value: "Very Bad",
                        votes: Math.round(Math.random() * 20)
                    }
                ]
            });
        }
        return Poll.create(polls);
    })
    .then(() => {
        process.exit();
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });