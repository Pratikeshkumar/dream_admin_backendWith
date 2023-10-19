const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminUserApis = require('../../controllers/admin/admin_users')



router.get('/getUsers/:page/:perPage', adminAuth, adminUserApis.getUsers)
router.delete('/deleteUsers/:id', adminAuth, adminUserApis.deleteUsers)



module.exports = router