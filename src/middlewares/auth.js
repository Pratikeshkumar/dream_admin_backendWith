const jwt = require("jsonwebtoken");
const { JWT_KEY } = process.env;
const { User, Admin } = require("../models");
const errorHandler = require('../utils/errorObject');
const logger = require('../utils/logger');
const { redis } = require('../config/redis')

exports.userAuth = async (req, res, next) => {
  logger.info("AUTH: USER AUTH MIDDLEWARE CALLED");
  try {
    if (!req.headers.authorization) throw errorHandler("Token not found in header!", "notFound");

    const token = req.headers.authorization.split(" ")[1];
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

    req.userData = userData;
    next();
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};


exports.adminAuth = async (req, res, next) => {
  logger.info("AUTH: ADMIN AUTH MIDDLEWARE CALLED");
  try {
    if (!req.headers.authorization) throw errorHandler("Token not found in header!", "notFound");

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_KEY);

    let userData = await Admin.findOne({
      where: { email: decoded.email },
      // attributes: ["email"],
    });
    userData = JSON.parse(JSON.stringify(userData));
    // console.log(userData,"userData")

    if (!userData && !userData.active) throw errorHandler("Account is deactivated!", "unAuthorized");

    req.userData = userData;
    next();
  } catch (error) {
    logger.error(error);

    return next(error)
  }
};

// {
//   id: 4,
//   first_name: 'Dream',
//   last_name: 'Users',
//   email: 'dream@gmail.com',
//   password: '$2b$10$JPFhUY1pA4FN1N1F9j6WN.I6PA6CEWfs.5I4dS3KmSaQf47alBSg2',
//   role: 'superadmin',
//   active: 1,
//   created: '2023-09-28T09:20:46.000Z'
// } 
