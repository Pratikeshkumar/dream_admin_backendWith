const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminwithdrawrequest = require('../../controllers/admin/admin_withdrawel')



// router.get('/getUsers/:page/:perPage', adminAuth, adminUserApis.getUsers)
router.get('/getwithdrawrequest', adminAuth, adminwithdrawrequest.getwithdrawrequest);


module.exports = router