var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

var UserModel = require('../models/user');

router.get('/', function(req, res) {
    res.render('register');
});

router.post('/', function(req, res) {
    console.log(req.body);
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

            const expiration = 90000;
            const token = jwt.sign({username: req.body.username}, 'theSecret');
            res.cookie('token', token, {
                expires: new Date(Date.now() + expiration),
                secure: false,
                httpOnly: false,
            });

            res.json({ success: true});
        });
});

module.exports = router;