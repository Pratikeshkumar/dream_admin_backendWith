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
const { liveStreamGiftStore, Transaction, User, UserPrivacy } = require('./src/models')
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
// setTimeout(async() => {
//   await getTimeToTimeHighestDiamondUser(1000000)

// }, 20000);



// running a task every hour
cron.schedule('0 * * * *', async () => {
  console.log('running a task every hour');
  await getTimeToTimeHighestDiamondUser(1, 'last_1_hour')
});

// running a task every day at 12 AM
cron.schedule('0 0 * * *', async () => {
  console.log('running a task every day at 12 AM');
  await getTimeToTimeHighestDiamondUser(24, 'last_24_hours')
});

// running a task every Monday at 1 AM
cron.schedule('0 1 * * 1', async () => {
  console.log('running a task every Monday at 1 AM');
  await getTimeToTimeHighestDiamondUser(168, 'last_7_days')
});

// running a task at 12 AM on the 1st day of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('running a task at 12 AM on the 1st day of every month');
  await getTimeToTimeHighestDiamondUser(732, 'last_30_days')
});







const router = require("./src/routes/index");
const { get } = require("http");

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



