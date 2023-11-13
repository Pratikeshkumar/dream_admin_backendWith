
const logger = require('../utils/logger')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { JWT_KEY } = process.env;
const { redis } = require('../config/redis')






const authenticateSocket = async (socket, next) => {
    logger.info('INFO -> SOCKET AUTH CALLED')

    const token = socket.handshake.auth.token;

    if (token) {
        const decoded = jwt.verify(token, JWT_KEY);
        let userData = await User.findOne({
            where: { email: decoded.email }
        });
        userData = JSON.parse(JSON.stringify(userData));

        if (!userData) throw errorHandler("Token expired!", "unAuthorized");
        socket.userData = userData;
        return next();
    } else {
        logger.error('SOCKET AUTHENTICATION FAILED')
        return next(new Error('Authentication failed'));
    }


};



module.exports = {
    authenticateSocket
}