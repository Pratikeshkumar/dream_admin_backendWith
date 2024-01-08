
const logger = require("../../utils/logger");
const { VideoReport ,User} = require("../../models");
const { Sequelize, Op } = require('sequelize');


  // const getVideoReport = async (req, res) => {
  //   try {
  //     const videoReports = await VideoReport.findAll(); // You may need to add conditions based on your use case
  
  //     res.status(200).json({
  //       message: 'success',
  //       data: videoReports
  //     });
  //   } catch (error) {
  //     logger.error(error);
  //     res.status(500).json({ message: 'error while fetching video reports', error });
  //   }
  // }
  const getVideoReport = async (req, res) => {
    try {
        // Retrieve video reports from the database
        const videoReports = await VideoReport.findAll();

        // Check if any video reports were found
        if (!videoReports || videoReports.length === 0) {
            return res.status(404).json({ message: 'No video reports found' });
        }

        // Create an array to store user IDs
        const userIds = [];

        // Extract user IDs from video reports
        videoReports.forEach(videoReport => {
            userIds.push(videoReport.reporterId);
        });

        logger.info('User IDs:', userIds);

        // Fetch user information based on user IDs
        const users = await User.findAll({
            where: {
                id: userIds
            }
        });

        logger.info('Users:', users);

        // Create a map for quick access to user information based on user ID
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Attach user information to each video report
        const videoReportsWithUsers = videoReports.map(videoReport => ({
            ...videoReport.toJSON(),
            reportedUser: userMap.get(videoReport.reporterId)
        }));

        logger.info('Video Reports with Users:', videoReportsWithUsers);

        // Return the list of video reports with user information
        res.status(200).json({
            message: 'success',
            data: videoReportsWithUsers
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'error while fetching video reports', error });
    }
};

  


  module.exports = {
    getVideoReport
  };
  