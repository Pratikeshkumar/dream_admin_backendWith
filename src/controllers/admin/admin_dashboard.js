// admin dashboard

// first i have to decide the total number of users , 
// last five days user
// growth of application 
// total no. of videos in the application and the top five trending videos,withusrname and photo
// most videos with diamonds
//



const logger = require("../../utils/logger");
const { User,Video ,UserInteraction,VideoView,PostComment} = require("../../models");
const { Sequelize ,Op} = require('sequelize');


const getUsers = async (req, res) => {
      logger.info("INFO -> GETTING USERS API CALLED");
      try {
        // Retrieve all users without pagination
        const users = await User.findAll({
          // Add sorting options here if needed
        });
    
        res.status(200).json({
          message: "Users retrieved successfully",
          data: users,
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
    
        const videoCount = await Video.count(); // Counting the number of videos
    
        res.status(200).json({
          message: "Videos retrieved successfully",
          data: videos,
          videoCount: videoCount, // Including the count in the response
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
        getUsers,getVideos
    }