const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { testDbConnection } = require("./src/config/db");
const { headers } = require("./src/middlewares/headers");
const errorHandling = require('./src/utils/apiError');
const errorHandler = require('./src/middlewares/errorHandler');
const log = require('./src/utils/logger');
const AWS = require('aws-sdk')
const { s3 } = require('./src/config/aws')
const { Avatar, User, Hobbies, PostComment } = require('./src/models')
const axios = require('axios')
const cheerio = require('cheerio')







PostComment.sync()






const router = require("./src/routes/index");

const app = express();


app.use(headers);
testDbConnection();
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./src/uploads"));
app.use(cookieParser());

app.use("", router);

/****************** ERORR HANDLING */
// error handlers for not found
app.use((req, res, next) => {
  log.error("*************** API NOT FOUND ***************")
  next(new errorHandling("route not found", "notFound"));
});

// error handler
app.use(errorHandler);

module.exports = app;



