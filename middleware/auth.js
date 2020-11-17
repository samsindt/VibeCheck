const jwt = require('jsonwebtoken');

module.exports = {
    verifyJWTCookie: (req, res, next) => {
        const token = req.cookies.token || '';
        try {
            if (!token) {
                res.redirect('/account/login');
                return;
            }
            const decrypt = jwt.verify(token, 'theSecret');
            req.user = {
                username: decrypt.username,
            };
    
            next();
            
        } catch (err) {
            return res.status(500).json(err.toString());
        }
    },
}