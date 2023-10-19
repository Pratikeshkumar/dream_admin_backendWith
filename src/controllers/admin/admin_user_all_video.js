const { Video, PostComment, CommentReply, Tag, Like, User, Gift, NewVideo, City, Country, VideoCountry, VideoCity, TaggingUser, TaggingText, PicturePost,VideoView ,PostCommentReply} = require("../../models");
const logger = require('../../utils/logger')
const errorHandler = require("../../utils/errorObject");
const sequelize = require('sequelize');
const { sq } = require('../../config/db');
const { s3 } = require('../../config/aws')
const {literal} = require('sequelize')
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
      // where: {
      //   status: "public"
      // },
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
        }
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
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

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    // First, delete associated comments
    await PostComment.destroy({ where: { video_id: id } });
    await Like.destroy({ where: { video_id: id } });
    await VideoView.destroy({ where: { video_id: id } });
    await PostCommentReply.destroy({ where: { video_id: id } });

    // Then, delete the video
    await Video.destroy({ where: { id: id } });

    res.status(200).json({ message: 'Video and associated comments deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting video and comments', error: error.message });
  }
};



   
  module.exports = {
    getAllUserVideos,
    deleteVideo
  }