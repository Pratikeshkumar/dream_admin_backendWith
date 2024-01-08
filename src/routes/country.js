const express = require('express')
const router = express.Router()


const countryApi = require('../controllers/version 2.0/country')

router.get('/allCountry', countryApi.getAllcountries)
router.get('/getCitiesByCode/:country_code', countryApi.getCitiesbyCode)

module.exports = router