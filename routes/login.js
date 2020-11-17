var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var UserModel = require('../models/user');

router.get('/', function(req, res) {
    res.render('login');
});

router.post('/', function(req, res) {
    //query db for login

    UserModel.exists({username: req.body.username, password: req.body.password}, function(err, hasDoc) {
        if (err) {
            return res.status(422).json( {success: false, error: err});
        } else if (hasDoc) {
            // generate jwt and add to cookies, then redirect to home page
            const expiration = 90000;
            const token = jwt.sign({username: req.body.username}, 'theSecret');
            res.cookie('token', token, {
                expires: new Date(Date.now() + expiration),
                secure: false,
                httpOnly: false,
            });

            return res.redirect('/');
        } else {
            res.status(401).json( {success: false, error: err});
            //send rejection message
        }
    });
  });
  
module.exports = router;