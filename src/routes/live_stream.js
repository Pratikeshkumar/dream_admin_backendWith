const express = require('express')

const router = express.Router();


const live_streamApi = require('../controllers/version 2.0/live_stream');
const { userAuth } = require('../middlewares/auth');


router.post('/addLiveSettings', userAuth, live_streamApi.addLiveSettings)
router.post('/updateActiveLive', userAuth, live_streamApi.updateActiveLive)
router.get('/getAllActiveLiveStream/:pageNo/:pageSize', live_streamApi.getAllActiveLiveStream)
router.get('/getAllLiveStreamGift/:categories', live_streamApi.getAllLiveStreamGift)





module.exports = router;