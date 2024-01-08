const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminDiamondApis = require('../../controllers/admin/diamond_transaction')




router.get('/getRoseTransaction', adminAuth, adminDiamondApis.getRoseTransaction)
router.get('/getMessageSubscriptionTransaction', adminAuth, adminDiamondApis.getMessageSubscriptionTransaction)
router.get('/getVideoGiftTransaction', adminAuth, adminDiamondApis.getVideoGiftTransaction)





module.exports = router