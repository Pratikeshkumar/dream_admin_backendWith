const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const analyticsApi = require('../controllers/version 1.0/analytics')

/************************************* CONTROLLER VERSION 1.0 */
// router.get('/getDiamondAnalytics/:startingtime/:endingtime', userAuth, analyticsApi.getDiamondAnalytics);
router.get('/ViewersSubmitComment/:startingtime/:endingtime', userAuth, analyticsApi.ViewersSubmitComment);
router.get('/getLikeAnalytics/:startingtime/:endingtime', userAuth, analyticsApi.getLikeAnalytics);
router.get('/getCoinAnalytics/:startingtime/:endingtime', userAuth, analyticsApi.getCoinAnalytics);
router.get('/getFollowAnalytics/:startingtime/:endingtime', userAuth, analyticsApi.getFollowAnalytics);
router.get('/getUserInteractions/:startingtime/:endingtime', userAuth, analyticsApi.getUserInteractions);








module.exports = router