const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminUserApis = require('../../controllers/admin/admin_notification')
const upload = require('../../middlewares/uploadData')



router.get('/getNotification', adminAuth, adminUserApis.getNotification)
router.post('/sendNotification', adminAuth, upload.fields([
    { name: 'large_icon', maxCount: 1 },
    { name: 'big_picture', maxCount: 1 }
  ]), adminUserApis.sendNotification);
  


module.exports = router