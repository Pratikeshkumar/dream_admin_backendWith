const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminHobbiesApi = require('../../controllers/admin/admin_hobbies')


router.post('/addHobbies', adminAuth, adminHobbiesApi.addHobbies)
router.get('/getHobbies/:page/:perPage', adminAuth, adminHobbiesApi.getHobbies)
router.put('/updateHobbies/:id', adminAuth, adminHobbiesApi.updateHobbies)
router.delete('/deleteHobbies/:id', adminAuth, adminHobbiesApi.deleteHobbies)



module.exports = router