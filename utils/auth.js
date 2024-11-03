'use strict';

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

const generateToken = (data) => {
    const expires = parseInt(process.env.JWTEXPIRESIN, 10);
    const plainData = { name: data.name, email: data.email };
    try {
        return jwt.sign(plainData, process.env.JWTSECRET, { expiresIn: expires });
    } catch (error) {
        return '';
    }
};

module.exports = { authMiddleware, generateToken };