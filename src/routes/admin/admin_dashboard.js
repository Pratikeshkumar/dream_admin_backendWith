const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminDashboardApis = require('../../controllers/admin/admin_dashboard')
router.get('/getUsers', adminAuth,adminDashboardApis.getUsers)
router.get('/getVideos',adminAuth,adminDashboardApis.getVideos)




module.exports = router