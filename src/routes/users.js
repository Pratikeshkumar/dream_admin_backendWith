const express = require('express');
const router = express.Router();

const { remove, update } = require('../controllers/version 1.0/users');
const { getAllPosts, getFeeds } = require('../controllers/version 1.0/userPost');
const { getAllUserFriends } = require('../controllers/version 1.0/friends');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/uploadData');
const { userAuth } = require('../middlewares/auth');
const userApis2 = require('../controllers/version 2.0/users');
const userValidation = require('../validations/user');


/************************************* CONTROLLER VERSION 1.0 */
router.delete('/delete', userAuth, remove);
router.patch('/update', userAuth, update);
 
//User posts routes
router.get('/:userId/posts', getAllPosts);
router.get('/:userId/friends', getAllUserFriends);
router.get('/:userId/feeds', getFeeds);
router.get('/followersDetails/:user_id', validate(userValidation.userInfoById), userApis2.getFollowersDetails)
router.get('/followingsDetails/:user_id', validate(userValidation.userInfoById), userApis2.getFollowingsDetails)
router.get('/getAllFollowingsUsers', userAuth, userApis2.getAllFollowingsUsers)

/************************************* VERSION 2.0 */
router.post('/signup', userApis2.signup);
router.post('/login', userApis2.login);
router.put('/update', userAuth, validate(userValidation.updateUser), userApis2.updateUser);
router.get('/info', userAuth, userApis2.userInfo);
router.post('/userExist',  userApis2.userExist)
router.post('/transaction', userAuth, userApis2.storePayments)
router.post('/gifts', userAuth, userApis2.sendGifts)
router.post('/follow', userAuth, userApis2.follow)
router.post('/unfollow', userAuth, userApis2.unfollow)



router.post('/upload', upload.fields([{ name: "source", maxCount: 1 }]), userApis2.uploadData);
router.get('/infoById/:user_id', validate(userValidation.userInfoById), userApis2.userInfoById);
router.get('/getAllMessages/:chatedPerson', userAuth, userApis2.getAllMessages )
router.get('/getMyAllChatedPerson', userAuth, userApis2.getMyAllChatedPerson )

/****************************** AVATAR */

router.get('/avatar', userApis2.getAvatar)


module.exports = router
