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
const { liveStreamGiftStore, Transaction } = require('./src/models')
const axios = require('axios')
const nms = require('./src/live_handler/index')
const { kafka, consumer, admin } = require('./src/config/kafka')
const { redis, testRedisConnection } = require('./src/config/redis')
const uuid = require('uuid')
const cron = require('node-cron')
const { getTimeToTimeHighestDiamondUser } = require('./src/workers/updateTimeToTimeDiamond')





nms.run()
testDbConnection();
testRedisConnection()
setTimeout(async() => {
  await getTimeToTimeHighestDiamondUser(100000)

}, 20000);









const router = require("./src/routes/index");

const app = express();


app.use(headers);
testDbConnection();
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(cookieParser());

app.use("", router);



app.use((req, res, next) => {
  log.error("*************** API NOT FOUND ***************")
  next(new errorHandling("route not found", "notFound"));
});

app.use(errorHandler);

module.exports = app;



