const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminUserApis = require('../../controllers/admin/admin_generate_reports')
router.get('/getVideoReport', adminAuth, adminUserApis.getVideoReport);


module.exports = router