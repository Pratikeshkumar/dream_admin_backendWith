const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminEmployeeApi = require('../../controllers/admin/admin_employee')


router.post('/addEmployee', adminAuth, adminEmployeeApi.addEmployee)
router.get('/getEmployee', adminAuth, adminEmployeeApi.getEmployees)
router.put('/activateEmployee/:id', adminAuth, adminEmployeeApi.activateEmployee)
router.put('/deactivateEmployee/:id', adminAuth, adminEmployeeApi.deactivateEmployee)
router.delete('/deleteEmployee/:id', adminAuth, adminEmployeeApi.deleteEmployee)

module.exports = router