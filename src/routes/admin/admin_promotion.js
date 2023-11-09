const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminPromotionApi = require('../../controllers/admin/admin_promotions')
router.get('/getPromotion/', adminAuth, adminPromotionApi.getPromotions)




module.exports = router