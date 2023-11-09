const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminOccupationsApi = require('../../controllers/admin/admin_occupations')

router.post('/addOccupations', adminAuth, adminOccupationsApi.addOccupations)
router.get('/getOccupations/:page/:perPage', adminAuth, adminOccupationsApi.getOccupations)
router.put('/updateOccupation/:id', adminAuth, adminOccupationsApi.updateOccupation)
router.delete('/deleteOccupation/:id', adminAuth, adminOccupationsApi.deleteOccupation)



module.exports = router