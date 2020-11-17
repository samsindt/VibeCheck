var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var UserModel = require('../models/user');

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    //query db for login

    UserModel.exists({username: req.body.username, password: req.body.password}, function(err, hasDoc) {
        if (err) {
            return res.status(422).json( {success: false, error: err});
        } else if (hasDoc) {
            // generate jwt and add to cookies, then redirect to home page
            setTokenCookie(res, req.body.username)

            return res.redirect('/');
        } else {
            res.status(401).json( {success: false, error: err});
            //send rejection message
        }
    });
  });


  router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    UserModel.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        squestions: req.body.squestions,
        },
        function(err) {
            if (err) {
                // check for duplicate username
                res.status(422);

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
    const token = jwt.sign({username: username}, 'theSecret');
    res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false,
        httpOnly: false,
    });
}
  
module.exports = router;