const express = require('express');
const router = express.Router();

const { userAuth } = require('../middlewares/auth');
const upload = require('../middlewares/uploadData');
const videoApis2 = require('../controllers/version 2.0/videos');
const validate = require('../middlewares/validate');
const videoValidation = require('../validations/video');

/************************************* CONTROLLER VERSION 2.0 */
router.post("/video", userAuth, upload.fields([{ name: 'source', maxCount: 1, optional: true }, { name: 'cover', maxCount: 1, optional: true }]), validate(videoValidation.uploadVideo), videoApis2.uploadVideo);
router.get("/userAllVideos", userAuth, videoApis2.getAllUserVideos);
router.get("/userPostedImages", validate(videoValidation.getUserPostedImages), videoApis2.getUserPostedImages);
router.get("/allVideos", videoApis2.allVideos);
router.get("/video", userAuth, validate(videoValidation.getVideo), videoApis2.getVideo);
router.patch("/video/:videoId", userAuth, validate(videoValidation.updateVideo), videoApis2.updateVideo);
router.delete("/video", userAuth, validate(videoValidation.deleteVideo), videoApis2.deleteVideo);

router.post("/like/:video_id", userAuth, validate(videoValidation.likeVideo), videoApis2.likeVideo);
router.post("/comment/:video_id", userAuth, validate(videoValidation.commentVideo), videoApis2.commentVideo);
router.post("/replyComment/:comment_id", userAuth, validate(videoValidation.replyComment), videoApis2.replyComment);
router.get("/involvedVideos", userAuth, videoApis2.userInvolvedVideos);
router.get("/allComments/:video_id", userAuth, validate(videoValidation.allComments), videoApis2.allComments);
router.post('/giftVideo', userAuth, validate(videoValidation.giftVideo), videoApis2.giftVideo);
router.get("/searchAllVideos", userAuth, validate(videoValidation.searchAllVideos), videoApis2.searchAllVideos);
router.get("/searchVideosFromProfile", userAuth, validate(videoValidation.searchVideosFromProfile), videoApis2.searchVideosFromProfile);
router.get("/userInvolvedVideosById/:user_id", userAuth, videoApis2.userInvolvedVideosById);
router.get("/stats/:video_id", userAuth, validate(videoValidation.videoStats), videoApis2.videoStats);

module.exports = router;
