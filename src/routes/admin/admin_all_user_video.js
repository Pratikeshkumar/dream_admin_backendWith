const express = require("express");

const router = express.Router();

const { adminAuth } = require("../../middlewares/auth");
const user_all_video = require("../../controllers/admin/admin_user_all_video");

router.get("/getAllUserVideos/:page/:perPage", adminAuth, user_all_video.getAllUserVideos);
router.delete('/deleteVideos/:id', adminAuth, user_all_video.deleteVideo)
router.patch('/updateLikeVideos/:id', adminAuth, user_all_video.updateVideoLike)
router.patch('/BlockVideo/:id', adminAuth, user_all_video.blockVideo)
router.patch('/updateUnBlockVideo/:id', adminAuth, user_all_video.UnblockVideo)
router.get("/getBlockedVideo/:page/:perPage", adminAuth, user_all_video.getBlockedVideo);
router.patch('/UnblockVideoStatus/:id', adminAuth, user_all_video.UnblockVideoStatus)
router.patch('/updateVideoDiamond/:id',adminAuth,user_all_video.updateVideoDiamond)
router.patch('/updateVideoShare/:id',adminAuth,user_all_video.updateVideoShare)
router.patch('/updateVideoCount/:id',adminAuth,user_all_video.updateVideoCount)
router.delete('/deleteVideoCount/:id',adminAuth,user_all_video.deleteVideoCount)



module.exports = router
