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
const { Avatar, User, Hobbies, PostComment, Language, Topic } = require('./src/models')
const axios = require('axios')
const cheerio = require('cheerio')
const nms = require('./src/live_handler/index')
const { kafka, consumer, admin } = require('./src/config/kafka')
const { redis, testRedisConnection } = require('./src/config/redis')
const uuid = require('uuid')


const tryConneect = async () => {
  await consumer.connect()
  const producer = kafka.producer()
  await producer.connect()
  console.log("producer conneted successfully ")
}

const listTopic = async () => {
  try {
    await admin.connect();
    const topics = await admin.listTopics()
    console.log(topics)
    await admin.disconnect();
  } catch (error) {
    console.error('Error listing Kafka topics:', error);
  }
}

// listTopic();

tryConneect()
nms.run()
testDbConnection();
testRedisConnection()




















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



