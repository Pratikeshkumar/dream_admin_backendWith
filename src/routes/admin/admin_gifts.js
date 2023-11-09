const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminGiftsApi = require('../../controllers/admin/admin_gifts')



router.get('/getGifts/:page/:perPage', adminAuth,adminGiftsApi.getGifts)
// router.delete('/deletGifts/:id', adminAuth, adminHobbiesApi)



module.exports = router