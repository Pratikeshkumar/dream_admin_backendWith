const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const admingiftlistingApis = require('../../controllers/admin/admin_gift_listing')



router.post('/addGiftListing', adminAuth,  admingiftlistingApis.addGifts_listing)
router.get('/getGiftListing/:page/:perPage', adminAuth, admingiftlistingApis.getGifts_listing)

router.delete('/deleteGiftListing/:id', adminAuth, admingiftlistingApis.deleteGifts_listing)



module.exports = router