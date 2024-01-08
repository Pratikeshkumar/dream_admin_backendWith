const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminCitiesApi = require('../../controllers/admin/admin_cities')


router.post('/addCities', adminAuth, adminCitiesApi.addCities)
router.get('/getCities/:page/:perPage', adminAuth, adminCitiesApi.getCities)
router.put('/updateCities/:id', adminAuth, adminCitiesApi.updateCities)
router.delete('/deleteCities/id', adminAuth, adminCitiesApi.deleteCities)



module.exports = router