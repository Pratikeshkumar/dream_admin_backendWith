const express = require('express');
const router = express.Router();

const users = require("./users");
const videos = require("./videos");
const comments = require("./comments");
const likes = require("./likes");
const friends = require("./friends");
const country = require('./country');
const search = require('./search')
const analytics = require('./analytics')
const message_subscription = require('./messageSubscription')
const payment = require('./payments')
const admin = require('./admin/index')
const topic = require('./topic')
const live_stream = require('./live_stream')
const promotion = require('./promotion')
const user_privacy = require('./user_privacy')


router.use("/users", users);
router.use("/videos", videos);
router.use("/comments", comments);
router.use("/likes", likes);
router.use("/friends", friends);
router.use("/country", country)
router.use('/search', search)
router.use('/analytics', analytics)
router.use('/message_subscription', message_subscription)
router.use('/payments', payment)
router.use('/admin', admin)
router.use('/topic', topic)
router.use('/live_stream', live_stream)
router.use('/promotion', promotion)
router.use('/user_privacy', user_privacy)


module.exports = router;