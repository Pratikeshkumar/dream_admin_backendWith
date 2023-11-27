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

        // Try to get user data from Redis cache
        let userData = await redis.get(decoded.email);

        if (userData) {
          // Parse user data from JSON string to object
          userData = JSON.parse(userData);
        } else {
          // If user data is not in Redis cache, get it from the database
          userData = await User.findOne({
              where: { email: decoded.email }
          });

          // Store user data in Redis cache for future requests
          await redis.set(decoded.email, JSON.stringify(userData));
        }

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