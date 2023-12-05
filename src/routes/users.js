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
router.get('/checkUsernameAvaliable/:value', userApis2.checkUsernameAvaliable)
router.get('/getLanguageAllLanguageList/:page_no/:page_size', userApis2.getLanguageAllLanguageList)
router.get('/searchLanguage/:search_text', userApis2.searchLanguage)
router.get('/getAllHobbiesList/:page_no/:page_size', userApis2.getAllHobbiesList)
router.get('/searchHobbies/:search_text', userApis2.searchHobbies)
router.get('/sendNotification', userApis2.sendNotification)
router.post('/getUserShortInfo', userApis2.getUserShortInfo)
router.post('/getMultipleUsersDiamond', userAuth, userApis2.getMultipleUsersDiamond)
router.get('/isUsersFollowings/:user_id', userAuth, userApis2.isUsersFollowings)
router.get('/getAllUserDiamondsByRanked/:page_no/:page_size', userAuth, userApis2.getAllUserDiamondsByRanked)


/************************************* VERSION 2.0 */
router.post('/signup', userApis2.signup);
router.post('/login', userApis2.login);
router.put('/update', userAuth, validate(userValidation.updateUser), userApis2.updateUser);
router.get('/info', userAuth, userApis2.userInfo);
router.post('/userExist', userApis2.userExist)
router.post('/transaction', userAuth, userApis2.storePayments)
router.post('/gifts', userAuth, userApis2.sendGifts)
router.post('/follow', userAuth, userApis2.follow)
router.post('/unfollow', userAuth, userApis2.unfollow)
router.post('/addUserInteractionTime', userAuth, userApis2.addUserInteractionTime)
router.post('/changeProfilePicture', userAuth, upload.fields([{ name: 'images', maxCount: 1 }]), userApis2.changeProfilePicture)
router.post('/changeProfileVideo', userAuth, upload.fields([{ name: 'videos', maxCount: 1 }]), userApis2.changeProfileVideo)
router.post('/addView', userApis2.addView)
router.post('/addProfileVisit', userAuth, userApis2.addProfileVisit)
router.post('/addBlockedUser', userAuth, userApis2.addBlockedUser)
router.post('/removeBlockedUser', userAuth, userApis2.removeBlockedUser)
router.post('/addFavouriteUser', userAuth, userApis2.addFavouriteUser)
router.post('/removeFavouriteUser', userAuth, userApis2.removeFavouriteUser)
router.post('/addUserReport', userAuth, userApis2.addUserReport)
router.post('/UserFriendSendDiamond',userApis2.UserFriendSendDiamond)




router.post('/upload', upload.fields([{ name: "source", maxCount: 1 }]), userApis2.uploadData);
router.get('/infoById/:user_id', validate(userValidation.userInfoById), userApis2.userInfoById);
router.get('/getAllMessages/:chatedPerson', userAuth, userApis2.getAllMessages)
router.get('/getMyAllChatedPerson', userAuth, userApis2.getMyAllChatedPerson)
router.get('/getOccupations', userApis2.getOccupations)
router.get('/getOccupations',userApis2.getOccupations)
router.get('/getPurchaseCoins', userApis2.getPurchaseCoins)
router.get('/getRewardFromVideo',userApis2.getRewardFromVideo)
router.get('/getRewardFromRoseMessage',userApis2.getRewardFromRoseMessage)
router.get('/getRewardFromMessge',userApis2.getRewardFromMessge)
router.get('/getAllTypesRewards',userApis2.getAllTypesRewards)
router.get('/getUserFriendTransaction',userApis2.getUserFriendTransaction)
router.get('/Check_Username_Email',userApis2.Check_Username_Email)






router.post('/updatePicture', upload.fields([{ name: 'images', maxCount: 1 }]), userApis2.updatePicture)



/****************************** AVATAR */

router.get('/avatar', userApis2.getAvatar)


module.exports = router
