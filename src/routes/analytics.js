const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const analyticsApi = require('../controllers/version 1.0/analytics')

/************************************* CONTROLLER VERSION 1.0 */
router.get('/getDiamondAnalytics/:startingtime/:endingtime',userAuth,analyticsApi.getDiamondAnalytics);

router.get('/getLikeAnalytics/:startingtime/:endingtime',userAuth,analyticsApi.getLikeAnalytics)
module.exports = router
















module.exports = router
