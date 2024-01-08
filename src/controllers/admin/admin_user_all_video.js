const { Video, PostComment, CommentReply, Tag, Like, User, Gift, NewVideo, City, Country, VideoCountry, VideoCity, TaggingUser, TaggingText, PicturePost, VideoView, PostCommentReply } = require("../../models");
const logger = require('../../utils/logger')
const errorHandler = require("../../utils/errorObject");
const sequelize = require('sequelize');
const { sq } = require('../../config/db');
const { s3 } = require('../../config/aws')
const { literal } = require('sequelize')
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
// Video.belongsTo(PostComment,{
//   foreignKey:id
// })






// const getAllUserVideos = async (req, res, next) => {

//     logger.info("VERSION 2.0 -> VIDEO: GET ALL USER VIDEOS API CALLED");
//     try {

//       const page = parseInt(req.query.page, 10) || 1; 
//       console.log(page)// Get the requested page (default to 1 if not provided)
//       const pageSize = parseInt(req.query.pageSize, 10) || 50; // Get the number of items per page (default to 5 if not provided)

//       // Calculate the offset based on the page and page size
//       const offset = (page - 1) * pageSize;

//       // Query for random videos with pagination
//       const videos = await Video.findAndCountAll({
//         include: [
//           {
//             model: User,
//             attributes: ['id', 'username', 'profile_pic', 'bio', 'nickname', 'instagram', 'you_tube', 'facebook'],
//           },
//           {
//             model: Like,
//             as: 'likes',
//             attributes: ['id', 'reciever_id', 'sender_id'],
//           },
//         ],
//         limit: pageSize,
//         offset,
//         order: literal('RAND()'), 
//       });

//       return res.status(200).json({
//         success: true,
//         message: "Successfully fetched random videos!",
//         videos: videos.rows,
//         totalVideos: videos.count,
//         currentPage: page,
//         pageSize: pageSize,
//       });
//     } catch (error) {
//       logger.error(error);

//       return next(error);
//     }
//   };


const getAllUserVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET ALL VIDEOS API CALLED");
  try {
    const videos = await Video.findAll({
      include: [
        {
          model: PostComment,
          as: "comments",
        },
        {
          attributes: {
            exclude: ["first_name", "last_name", "password"]
          },
          model: User,
          as: "user"
        },
      ],
    });

    const videoIds = videos.map(video => video.id);

    const viewCounts = await VideoView.findAll({
      attributes: ['video_id', [Sequelize.fn('COUNT', 'video_id'), 'viewCount']],
      where: {
        video_id: {
          [Op.in]: videoIds,
        },
      },
      group: ['video_id'],
    });

    const viewCountMap = {};
    viewCounts.forEach(item => {
      viewCountMap[item.dataValues.video_id] = item.dataValues.viewCount;
    });

    const videosWithViewCount = videos.map(video => {
      const viewCount = viewCountMap[video.id] || 0;

      return {
        ...video.dataValues,
        viewCount
      };
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos: videosWithViewCount
    });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};


const getBlockedVideo = async (req, res) => {
  logger.info("INFO -> GETTING BLOCKED USERS API CALLED");

  try {
    // Retrieve deactivated users (assuming 0 means deactivated)
    const deactivatedVideo = await Video.findAll({
      where: {
        block: true, // Filter for deactivated users
      },
    });

    res.status(200).json({
      message: "BOCKED VIDEO retrieved successfully",
      data: deactivatedVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};








// const getAllUserVideos = async (req, res, next) => {
//   logger.info("VERSION 2.0 -> VIDEO: GET MY VIDEO BY FILTERS API CALLED");
//   try {
//     let { id, email } = req.userData;

//     const videos = await Video.findAll()

//     if (videos) {
//       res.status(201).json(videos)
//     }
//   } catch (error) {
//     logger.error(error);

//     return next(error);
//   }
// }

const updateVideoLike = async (req, res) => {
  logger.info('INFO -> UPDATING updateVideoLike API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route
    const { like } = req.body;

    // Find the video by ID
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'like' field of the video
    existingVideo.like = like;

    // Save the updated video to the database
    await existingVideo.save();

    res.status(200).json({
      message: 'Video like count updated successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
};


const blockVideo = async (req, res) => {
  logger.info('INFO -> BLOCKING blockVideo API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route
    console.log(id, "iddddd")

    // Find the video by ID
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'block' field of the video
    existingVideo.block = true;

    // Save the updated video to the database
    await existingVideo.save();

    res.status(200).json({
      message: 'Video blocked successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
};



const UnblockVideo = async (req, res) => {
  logger.info('INFO -> BLOCKING blockVideo API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route

    // Find the video by ID
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'block' field of the video
    existingVideo.block = false;

    // Save the updated video to the database
    await existingVideo.save();

    res.status(200).json({
      message: 'Video blocked successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
};



const UnblockVideoStatus = async (req, res) => {
  logger.info('INFO -> UNBLOCKING UnblockVideo API CALLED');
  try {
    const { id } = req.params; // Retrieve the 'id' parameter from the request URL

    // Find the video by ID (assuming you're using Sequelize ORM)
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'block' field of the video to false to unblock it
    existingVideo.block = false; // Assuming the field name is 'block' and you want to set it to false to unblock

    // Save the updated video to the database
    await existingVideo.save();

    res.status(200).json({
      message: 'Video unblocked successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error occurred while processing your request', error });
  }
};



const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the video record
    await Video.destroy({ where: { id } });

    res.status(200).json({ message: 'Video and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting video and associated data', error: error.message });
  }
};

const updateVideoDiamond = async (req, res) => {
  logger.info('INFO -> UPDATING updateVideoDiamond API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route
    const { diamond_value } = req.body;

    // Find the video by ID
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'like' field of the video
    existingVideo.diamond_value = diamond_value;

    // Save the updated video to the database
    await existingVideo.save();
    res.status(200).json({
      message: 'Video diamond_value count updated successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
};

const updateVideoShare = async (req, res) => {
  logger.info('INFO -> UPDATING updateVideoDiamond API CALLED');
  try {
    const { id } = req.params; // Assuming you have an 'id' parameter in the route
    const { shared } = req.body;

    // Find the video by ID
    const existingVideo = await Video.findByPk(id);

    if (!existingVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the 'shared' field of the video
    existingVideo.shared = shared;

    // Save the updated video to the database
    await existingVideo.save();
    res.status(200).json({
      message: 'Video shared count updated successfully',
      data: existingVideo,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
};
const updateVideoCount = async (req, res) => {
  logger.info('INFO -> UPDATING updateVideoCount API CALLED');
  try {
    const { id } = req.params;
    const { viewCount } = req.body;
    console.log(id,viewCount)

    // Create multiple VideoView entries in bulk for the video ID and view count
    const viewsToCreate = [];
    for (let i = 0; i < viewCount; i++) {
        viewsToCreate.push({ video_id: id });
    }

    await VideoView.bulkCreate(viewsToCreate);
    
    res.status(200).json({
        message: 'Video view count updated successfully',
        videoId: id,
        newViewCount: viewCount,
    });
} catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ message: 'Error updating view count', error });
}
};

const deleteVideoCount = async (req, res) => {
  logger.info('INFO -> DELETING VideoCount API CALLED');
  try {
    const { id } = req.params;
    const { viewCount } = req.query;
    console.log(req.query, "count");

    // Assuming you want to delete a certain number of VideoView entries based on video_id
    const deletedRows = await VideoView.destroy({
      where: { video_id: id },
      limit: parseInt(viewCount), // Parse viewCount to an integer
    });

    res.status(200).json({
      message: `Bulk deletion of ${deletedRows} video views successful for video ID: ${id}`,
      videoId: id,
      deletedCount: deletedRows,
    });
  } catch (error) {
    console.error('Error with bulk deletion:', error);
    res.status(500).json({ message: 'Error during bulk deletion', error });
  }
};



const sendGiftInVideo =  



module.exports = {
  getAllUserVideos,
  deleteVideo,
  updateVideoLike,
  blockVideo,
  UnblockVideo,
  getBlockedVideo,
  UnblockVideoStatus,
  updateVideoDiamond,
  updateVideoShare,
  updateVideoCount,
  deleteVideoCount
}