const express = require("express");
const router = express.Router();
const jwt_auth = require('../utils/utils_jwt');


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader && authHeader.split(' ')[1];
        try {
            jwt_auth.verifyJwt(token);
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        return res.sendStatus(401).json({ message: 'Unauthorized' });
    }
};

module.exports = this;