const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = {
    setJWTCookie: (res, username, userId) => {
        const expiration = 900000;
        const token = jwt.sign({username: username, userId: userId}, config.jwtSecretKey);
        res.cookie('token', token, {
            expires: new Date(Date.now() + expiration),
            secure: false,
            httpOnly: false,
        });
    }
}