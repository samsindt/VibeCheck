const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = {
    verifyJWTCookie: (req, res, next) => {
        const token = req.cookies.token || '';
        try {
            if (!token) {
                return res.redirect('/account/login');
            }
            const decrypt = jwt.verify(token, config.jwtSecretKey);
            req.user = {
                username: decrypt.username,
                userId: decrypt.userId
            };
    
            next();
            
        } catch (err) {
            return res.status(500).json(err.toString());
        }
    },
}