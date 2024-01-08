const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminTransactionApi = require('../../controllers/admin/admin_transaction')
router.get('/getTransaction/', adminAuth, adminTransactionApi.getTransaction)




module.exports = router