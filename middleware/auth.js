const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Unauthorized: Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
