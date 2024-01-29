const express = require('express')

const router = express.Router()

const { adminAuth } = require('../../middlewares/auth')
const adminUserApis = require('../../controllers/admin/admin_users')



// router.get('/getUsers/:page/:perPage', adminAuth, adminUserApis.getUsers)
router.get('/getUsers', adminAuth, adminUserApis.getUsers);
router.delete('/deleteUsers/:id', adminAuth, adminUserApis.deleteUsers)
router.patch('/updateUserActiveStatus/:id', adminAuth, adminUserApis.updateUserActiveStatus)
router.get('/getBlockedusers/:page/:perPage', adminAuth, adminUserApis.getBlockedUsers)
router.patch('/updateUserStatus/:id', adminAuth,adminUserApis.updateUserStatus)
router.get('/getUsersVideo/:user_id',adminAuth,adminUserApis.getUsersVideo)
router.post('/sendGift',adminAuth,adminUserApis.sendGifts)
router.get('/getBasicUsers', adminAuth, adminUserApis.getBasicUsers);
router.get('/getPremiumUsers', adminAuth, adminUserApis.getPremiumUsers);
router.get('/getuser_photo_post/:user_id', adminAuth, adminUserApis.get_user_photo_post);
router.patch('/changeUserAccount_type/:id', adminAuth, adminUserApis.changeUserAccount_type)

//getLikeinteraction
router.get('/getLikeinteraction/:user_id', adminAuth, adminUserApis.getLikeinteraction);
router.get('/getPostCommentInteraction/:user_id', adminAuth, adminUserApis.getPostCommentInteraction);
router.get('/getdiamondinteraction/:user_id', adminAuth, adminUserApis.getdiamondinteraction);
router.get('/getshareintraction/:user_id',adminAuth ,adminUserApis.getshareintraction)
router.get('/getsenderdiamond/:user_id',adminAuth,adminUserApis.getsenderdiamond)
router.get('/getsenderlikedata/:user_id',adminAuth, adminUserApis.getsenderlikedata)
router.get('/getrecivedcomment/:user_id',adminAuth,adminUserApis.getrecivedcomment)
router.get('/getrecivedshare/:user_id',adminAuth,adminUserApis.getrecivedshare)
module.exports = router