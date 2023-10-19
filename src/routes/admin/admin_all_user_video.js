const express = require("express");

const router = express.Router();

const { adminAuth } = require("../../middlewares/auth");
const user_all_video = require("../../controllers/admin/admin_user_all_video");

router.get("/getAllUserVideos/:page/:perPage", adminAuth, user_all_video.getAllUserVideos);
router.delete('/deleteVideos/:id', adminAuth, user_all_video.deleteVideo)

module.exports = router
