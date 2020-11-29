var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var UserModel = require('../models/user');
var SecurityQuestionModel = require('../models/security-question');
const config = require('../config.json');
const securityQuestion = require('../models/security-question');
const app = require('../app');
const { verifyJWTCookie } = require('../middleware/auth');
const { db } = require('../models/user');

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    //query db for login

    UserModel.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            return res.status(422).json( {success: false});
        }

        if (user) {
            // generate jwt and add to cookies, then redirect to home page
            setTokenCookie(res, req.body.username);

            return res.json({success: true});
        } else {
            res.status(401).json( {success: false, invalidCredentials: true});
        }
    });
});

router.get('/register', function(req, res) {
    const MIN_SECURITY_QUESTIONS = 3;

    SecurityQuestionModel.findRandom({}, {}, {limit: MIN_SECURITY_QUESTIONS}, function(err, results) {
        if (err) {
            console.error("Error: " + err.toString());
            res.sendStatus(500);
            return;
        }

        let questions = results.map(question => {
            return {id: question._id, text: question.text};
        });

        res.render('register', {securityQuestions: questions});
    });
});

router.post('/register', function(req, res) {
    var newUser = new UserModel();
    newUser.username = req.body.username;
    newUser.setPassword(req.body.password);
    newUser.email = req.body.email;
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.security.question = req.body.securityQuestion;
    newUser.security.answer = req.body.securityQuestionAnswer;

    newUser.save(function(err) {
        if (err) {
            
            res.status(422);
            // check for duplicate username
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.json({ success: false, duplicateUser: true});
            }

            return res.json({ success: false, error: err}) // probably should redirect to dedicated error page.
        }

        setTokenCookie(res, req.body.username);

        res.json({ success: true});
    });
});

router.post('/logout', function(req, res) {
    res.cookie('token', '', { expires: new Date()});
    res.sendStatus(200);
});

router.get('/updateProfile', verifyJWTCookie, function(req, res) {
    UserModel.findOne({id: req.user.id}, function(err, user) {
        if (err) {
            return res.status(422).json( {success: false});
        }
        if (user) {
            res.render('updateProfile', {username: user.username, 
                                           firstname: user.firstname, 
                                           lastname: user.lastname,
                                           email: user.email, 
                                           password: user.password})
            
        } else {
            res.status(401).json( {success: false, invalidCredentials: true});
        }
    });
});

router.post('/updateProfile', verifyJWTCookie, function(req, res) {
    UserModel.findOne({id: req.user.id}, function(err, user) {
        if (err) {
            return res.status(422).json( {success: false});
        }
        
        if (user) {
            updateUser = user;

            //if a value exists in the updateProfile_form then change the users 
            //information to match it
            if (req.body.username) {
                updateUser.username = req.body.username;
            }
            if (req.body.firstname) {
                updateUser.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                updateUser.lastname = req.body.lastname;
            }
            if (req.body.email) {
                updateUser.email = req.body.email;
            }
            //maybe works, maybe not
            if (req.body.password) {
                updateUser.setPassword (req.body.password);
            }
           //user.save 
            UserModel.findOneAndUpdate({id: req.user.id}, {
                username: updateUser.username,
                firstname: updateUser.firstname, 
                lastname: updateUser.lastname, email: updateUser.email}, 
                (err, data) => {
                if (err) {
                    return res.status(422).json( {success: false});
                }
            })
        } 
    });
});

function setTokenCookie(res, username) {
    const expiration = 90000;
    const token = jwt.sign({username: username}, config.jwtSecretKey);
    res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false,
        httpOnly: false,
    });
}
  
module.exports = router;