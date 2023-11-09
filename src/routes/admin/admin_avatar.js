const express = require('express')


const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminAvatarApi = require('../../controllers/admin/admin_avatar')

router.post('/addAvatar', adminAuth, adminAvatarApi.addAvatar)
router.get('/getAvatars/:page/:perPage', adminAuth, adminAvatarApi.getAvatars)
router.put('/updateAvatar/:id', adminAuth, adminAvatarApi.updateAvatar)
router.delete('/deleteAvatar/id', adminAuth, adminAvatarApi.deleteAvatar)



module.exports = router