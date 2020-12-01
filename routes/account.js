var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
var SecurityQuestionModel = require('../models/security-question');
var auth = require('../helpers/auth');
const { verifyJWTCookie } = require('../middleware/auth');

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    //query db for login

    UserModel.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            return res.status(422).json({success: false});
        }

        // if the username exists
        if (user) {

            // if the password is valid
            if (user.isValidPassword(req.body.password)) {
                // generate jwt and add to cookies, then redirect to home page
                auth.setJWTCookie(res, user.username, user._id);
                return res.json({success: true});
            }
        }

        res.status(401).json({success: false, invalidCredentials: true});
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
    newUser.password = req.body.password;
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
            
            return res.json({ success: false, error: err}); // probably should redirect to dedicated error page.
        }

        auth.setJWTCookie(res, newUser.username, newUser._id);

        res.json({ success: true});
    });
});

router.get('/updateProfile', verifyJWTCookie, function(req, res) {
    UserModel.findById (req.user.userId, function(err, user) {
        if (err) {
            return res.status(422).json({success: false});
        }
        
        if (user) {
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
        
                res.render('updateProfile', {username: user.username, securityQuestions: questions});
            });
        } else {
            res.status(401).json( {success: false, invalidCredentials: true});
        }
    });
});

router.post('/updateProfile', verifyJWTCookie, function(req, res) {
    UserModel.findById(req.user.userId, function(err, user) {
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
            if (req.body.password) {
               updateUser.password = req.body.password;
            }
            if (req.body.securityQuestion) {
                updateUser.security.question = req.body.securityQuestion;
            }
            if (req.body.securityQuestionAnswer) {
                updateUser.security.answer = req.body.securityQuestionAnswer;
            }

            user.save(function(err) {
        
                if (err) {
                    res.status(422);
                    // check for duplicate username
                    if (err.name === 'MongoError' && err.code === 11000) {
                        return res.json({ success: false, duplicateUser: true});
                    }
                    
                    return res.json({ success: false, error: err}); // probably should redirect to dedicated error page.
                }
            });
        } 
    });
});

router.post('/logout', function(req, res) {
    res.cookie('token', '', { expires: new Date()});
    res.sendStatus(200);
});
  
module.exports = router;



router.get('/profile', verifyJWTCookie, function(req, res) {
    UserModel.findById(req.user.userId, function(err, user) {
        if (err) {
            return res.status(422).json( {success: false});
        }
        console.log(user);
        if (user) {
            res.render('profile', {username: user.username, 
                                    firstname: user.firstname, 
                                    lastname: user.lastname,
                                    email: user.email})
            
        } else {
            res.status(401).json( {success: false, invalidCredentials: true});
        }
    });
});