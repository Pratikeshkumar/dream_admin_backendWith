// admin dashboard

// first i have to decide the total number of users , 
// last five days user
// growth of application 
// total no. of videos in the application and the top five trending videos,withusrname and photo
// most videos with diamonds
//



const logger = require("../../utils/logger");
const { User, Video, UserInteraction, VideoView, PostComment } = require("../../models");
const { Sequelize, Op } = require('sequelize');


const getUsers = async (req, res) => {
  logger.info("INFO -> GETTING USERS API CALLED");
  try {
    // Retrieve all users without pagination
    const users = await User.findAll({
      // Add sorting options here if needed
    });

    // Count the total number of all users
    const totalUsers = await User.count();

    // Count the total number of active users
    const activeUsers = await User.count({ where: { active: 1 } });

    // Count the total number of inactive users
    const inactiveUsers = await User.count({ where: { active: 0 } });

    // Count the total number of basic users
    const basicUsers = await User.count({ where: { account_type: 'basic' } });

    // Count the total number of premium users
    const premiumUsers = await User.count({ where: { account_type: 'premium' } });

    // Count the total number of business users
    const businessUsers = await User.count({ where: { account_type: 'business' } });

    res.status(200).json({
      message: "Users retrieved successfully",
      data: {
        users: users,
        totalUsers: totalUsers,
        totalActiveUsers: activeUsers,
        totalInactiveUsers: inactiveUsers,
        totalBasicUsers: basicUsers,
        totalPremiumUsers: premiumUsers,
        totalBusinessUsers: businessUsers,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};


const getVideos = async (req, res) => {
  logger.info("INFO -> GETTING VIDEOS API CALLED");
  try {
    const videos = await Video.findAll({
      // Add sorting options here if needed
    });

    const videoCount = await Video.count();

    const topVideosByDiamonds = await Video.findAll({
      order: [['diamond_value', 'DESC']],
      limit: 10
    });

    const topVideosByLikes = await Video.findAll({
      order: [['like', 'DESC']],
      limit: 10
    });

    const topVideosByShare = await Video.findAll({
      order: [['shared', 'DESC']],
      limit: 10
    });

    // const topVideosByViews = await Video.findAll({
    //   attributes: ['id'],
    //   include: [
    //     {
    //       model: VideoView,
    //       attributes: [],
    //       where: { video_id: Sequelize.col('videos.id') },
    //       as:"views"
    //     }
    //   ],
    //   group: ['videos.id'],
    //   order: [[Sequelize.literal('COUNT(video_view.id)'), 'DESC']],
    //   limit: 10
    // });

    res.status(200).json({
      message: "Videos retrieved successfully",
      data: videos,
      videoCount: videoCount,
      topVideosByDiamonds: topVideosByDiamonds,
      topVideosByLikes: topVideosByLikes,
      topVideosByShare: topVideosByShare,
      // topVideosByViews: topVideosByViews
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};






module.exports = {
  getUsers, getVideos
}