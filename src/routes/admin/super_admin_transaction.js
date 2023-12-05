const express = require('express')

const router = express.Router()

const SuperAdminTransactionApis = require('../../controllers/admin/super_admin_transaction')
const { adminAuth } = require('../../middlewares/auth')


router.post('/super_admintransactions', adminAuth,SuperAdminTransactionApis.addMoneyToSuperAdmin)
router.post('/sendMoneyToAdmin',adminAuth,SuperAdminTransactionApis.sendMoneyToAdmin)
router.get('/getWalletDetails',adminAuth,SuperAdminTransactionApis.getWalletDetails)
router.get('/getSuper_admin_transaction',adminAuth,SuperAdminTransactionApis.getSuper_admin_transaction)
router.get('/getadmin_transaction',adminAuth,SuperAdminTransactionApis.getadmin_transaction)
router.post('/sendMoneyToUser',adminAuth,SuperAdminTransactionApis.sendMoneyToUser)
router.post('/removeMoneyFromUser',adminAuth,SuperAdminTransactionApis.removeMoneyFromUser)






module.exports = router