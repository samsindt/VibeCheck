var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var UserModel = require('../models/user');
const config = require('../config.json');

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
            setTokenCookie(res, req.body.username)

            return res.json({success: true});
        } else {
            res.status(401).json( {success: false, invalidCredentials: true});
        }
    });
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    var newUser = new UserModel();
    newUser.username = req.body.username;
    newUser.setPassword(req.body.password);
    newUser.email = req.body.email;
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    // TODO: security questions

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