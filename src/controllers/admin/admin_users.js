// all users
// basic user
// premium user
// business user
// reported user
// reported user
// blocked user


const logger = require("../../utils/logger");
const { User,Video } = require("../../models");

// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");
//   try {
//     const { page = 1, perPage = 10} = req.query;

//     // Calculate the offset based on the page and perPage values
//     const offset = (page - 1) * perPage;

//     // Retrieve users with pagination
//     const users = await User.findAndCountAll({
//       limit: perPage,
//       offset,
//     });

//     res.status(200).json({
//       message: "Users retrieved successfully",
//       data: users.rows, // Corrected from User.rows to users.rows
//       total: users.count, // Corrected from User.count to users.count
//     });
//   } catch (error) {
//     logger.error(error);
//     res
//       .status(500)
//       .json({
//         message: "Error generated while processing your request",
//         error,
//       });
//   }
// };
// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");
//   try {
//     const { page = page, perPage = 10 } = req.query;

//     // Validate and sanitize page and perPage values
//     const parsedPage = parseInt(page, 10);
//     const parsedPerPage = parseInt(perPage, 10);

//     if (isNaN(parsedPage) || isNaN(parsedPerPage) || parsedPage < 1 || parsedPerPage < 1) {
//       return res.status(400).json({
//         message: "Invalid page or perPage values. Both should be positive integers.",
//       });
//     }

//     // Calculate the offset based on the page and perPage values
//     const offset = (parsedPage - 1) * parsedPerPage;

//     // Retrieve users with pagination
//     const users = await User.findAndCountAll({
//       limit: parsedPerPage,
//       offset,
//       // Add sorting options here if needed
//     });

//     res.status(200).json({
//       message: "Users retrieved successfully",
//       data: users.rows,
//       total: users.count,
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       message: "Error generated while processing your request",
//       error: error.message,
//     });
//   }
// };
// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");
//   try {
//     // Retrieve all users without pagination
//     const users = await User.findAll({
//       // Add sorting options here if needed
//     });

//     res.status(200).json({
//       message: "Users retrieved successfully",
//       data: users,
//     });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       message: "Error generated while processing your request",
//       error: error.message,
//     });
//   }
// };
const getUsers = async (req, res) => {
  logger.info("INFO -> GETTING USERS API CALLED");
  try {
    // Retrieve all users without pagination
    const users = await User.findAll({
      // Add sorting options here if needed
    });

    // Create an array to store user data with associated videos
    const usersWithVideos = [];

    // Loop through each user to retrieve associated videos
    for (const user of users) {
      const userJSON = user.toJSON();
      const videos = await Video.findAll({
        where: { user_id: user.id },
      });
      userJSON.videos = videos;
      usersWithVideos.push(userJSON);
    }

    res.status(200).json({
      message: "Users and associated videos retrieved successfully",
      data: usersWithVideos,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};



const deleteUsers = async (req, res) => {
  logger.info('INFO -> DELETING AllUser API CALLED');
  try {
      const { id } = req.params; // Assuming you have an 'id' parameter in the route

      // Find the hobby by ID
      const existingUser = await User.findByPk(id);

      if (!existingUser) {
          return res.status(404).json({ message: 'User not found' });
      }

     
      await existingUser.destroy();

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Error generated while processing your request', error });
  }
}


module.exports = {
  getUsers,
  deleteUsers

};
