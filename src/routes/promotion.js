const express = require('express')

const router = express.Router()
const promotionsApi = require('../controllers/version 2.0/promotions');
const { userAuth } = require('../middlewares/auth')


router.post('/startPromotions', userAuth, promotionsApi.startPromotions)

module.exports = router;