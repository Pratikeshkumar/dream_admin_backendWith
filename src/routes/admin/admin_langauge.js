const express = require('express')

const router = express.Router()

const adminLanguageApi = require('../../controllers/admin/admin_language')
const { adminAuth } = require('../../middlewares/auth')


router.post('/addLanguage', adminAuth, adminLanguageApi.addLanguage)
router.get('/getLanguage', adminLanguageApi.getLanguage)
router.put('/updateLanguage/:id', adminAuth, adminLanguageApi.updateLanguage)
router.delete('/deleteLanguage/:id', adminAuth, adminLanguageApi.deleteLanguage)



module.exports = router