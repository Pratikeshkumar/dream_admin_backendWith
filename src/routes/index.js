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


module.exports = router;