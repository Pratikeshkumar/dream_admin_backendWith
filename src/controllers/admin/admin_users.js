// all users
// basic user
// premium user
// business user
// reported user
// reported user
// blocked user


const logger = require("../../utils/logger");
const { User,Video ,UserInteraction,VideoView,PostComment} = require("../../models");
const { Sequelize ,Op} = require('sequelize');


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
const getBasicUsers = async (req, res) => {
  logger.info("INFO -> GETTING BasicUSERS API CALLED");
  try {
    // Retrieve all users without pagination
    const users = await User.findAll({
      where: {
        account_type: 'basic',
      },
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

const getPremiumUsers = async (req, res) => {
  logger.info("INFO -> GETTING BasicUSERS API CALLED");
  try {
    // Retrieve all users without pagination
    const users = await User.findAll({
      where: {
        account_type: 'premium',
      },
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
// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");
//   try {
//     // Retrieve all users without pagination
//     const users = await User.findAll({
//       // Add sorting options here if needed
//     });

//     // Create an array to store user data with associated videos
//     const usersWithVideos = [];

//     // Loop through each user to retrieve associated videos
//     for (const user of users) {
//       const userJSON = user.toJSON();``
//       const videos = await Video.findAll({
//         where: { user_id: user.id },
//       });
//       userJSON.videos = videos;
//       usersWithVideos.push(userJSON);
//     }

//     res.status(200).json({
//       message: "Users and associated videos retrieved successfully",
//       data: usersWithVideos,
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
//     // Retrieve all users with associated videos and interactions
//     const users = await User.findAll({
//       where:{
//         active:1

//       },
//       include: [
//         {
//           model: Video,
//         },
//         {
//           model: UserInteraction,
          

//         },
       
        
//       ],
//     });

//     res.status(200).json({
//       message: "Users, associated videos, and interactions retrieved successfully",
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



// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");

//   // Define pagination parameters
//   const page = req.query.page || 1; // Default to page 1 if not specified
//   const itemsPerPage = 10; // Number of users per page

//   try {
//     // Calculate the offset
//     const offset = (page - 1) * itemsPerPage;

//     // Use the Sequelize query to paginate in the database
//     const users = await User.findAndCountAll({
//       include: [
//         {
//           model: Video,
//         },
//         {
//           model: UserInteraction,
//         },
//       ],
//       offset, // Skip the appropriate number of items
//       limit: itemsPerPage, // Limit the number of items per page
//     });
//     console.log(users.count)
//     // Prepare response data
//     const response = {
//       users: users.rows,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(users.count / itemsPerPage),
//         totalUsers: users.count,
//         itemsPerPage,
//       },
//     };

//     // Send the response as JSON
//     res.json(response);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };







const updateUserActiveStatus = async (req, res) => {
  const userId = req.params.id;
  const newActiveStatus = req.body.isActive;
  console.log(newActiveStatus,"newActiveStatus")

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's active status
    user.active = newActiveStatus;
    await user.save();

    return res.status(200).json(user); // You can return the updated user object if needed.
  } catch (error) {
    console.error('Error updating user active status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getBlockedUsers = async (req, res) => {
  logger.info("INFO -> GETTING DEACTIVATED USERS API CALLED");

  try {
    // Retrieve deactivated users (assuming 0 means deactivated)
    const deactivatedUsers = await User.findAll({
      where: {
        active: 0, // Filter for deactivated users
      },
    });

    res.status(200).json({
      message: "Deactivated users retrieved successfully",
      data: deactivatedUsers,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};




const updateUserStatus = async (req, res) => {
  logger.info("INFO -> UPDATING USER STATUS API CALLED");

  const { id } = req.params;
  console.log(id, "req.params.id");

  const newStatus = 1; // Change the new status to 0 for deactivation

  try {
    // Find the user with the given ID
    const user = await User.findOne({
      where: { id: id },
    });

    if (!user) {
      // No user with the given ID was found
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the user's status to 0 for deactivation
    user.active = newStatus;
    await user.save();

    res.status(200).json({
      message: "User status updated to inactive (0) successfully",
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
// const getUsers = async (req, res) => {
//   logger.info("INFO -> GETTING USERS API CALLED");

//   // Define pagination parameters
//   const page = req.query.page || 1; // Default to page 1 if not specified
//   console.log(req.query.page,"page")
//   const itemsPerPage = 10; // Number of users per page

//   try {
//     // Calculate the offset to skip the appropriate number of items
//     const offset = (page - 1) * itemsPerPage;

//     // Retrieve users with associated videos and interactions, applying pagination
//     const users = await User.findAll({
//       include: [
//         // {
//         //   model: Video,
//         // },
//         {
//           model: UserInteraction,
//         },
//       ],
//       offset, // Skip the appropriate number of items
//       limit: itemsPerPage, // Limit the number of items per page
//     });

//     // Count all users (for total count, not just the current page)
//     const totalUsers = await User.count();

//     // Prepare response data
//     const response = {
//       users,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalUsers / itemsPerPage),
//         totalUsers,
//         itemsPerPage,
//       },
//     };

//     // Send the response as JSON
//     res.json(response);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





const getUsers = async (req, res) => {
  logger.info("INFO -> GETTING USERS API CALLED");

  const page = req.query.page || 1; // Default to page 1 if not specified
  const itemsPerPage = 10; // Number of users per page

  const searchQuery = req.query.search || ''; // Get the search term from the query parameters

  try {
    let whereCondition = {}; // Define an empty object for the WHERE condition

    // If there's a search term, construct the WHERE condition to filter by username or email
    if (searchQuery !== '') {
      whereCondition = {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${searchQuery}%` } },
          { email: { [Sequelize.Op.like]: `%${searchQuery}%` } }
        ]
      };
    }

    const offset = (page - 1) * itemsPerPage;

    // Retrieve users with associated interactions, applying pagination and search filter
    const users = await User.findAll({
      include: [
        {
          model: UserInteraction,
        },
      ],
      where: whereCondition, // Apply the WHERE condition for filtering
      offset,
      limit: itemsPerPage,
    });

    // Count users matching the search criteria
    const totalUsers = await User.count({ where: whereCondition });

    // Prepare response data
    const response = {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / itemsPerPage),
        totalUsers,
        itemsPerPage,
      },
    };

    // Send the response as JSON
    res.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};







const getUsersVideo = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const userVideos = await User.findByPk(userId, {
      include: [
        {
          model: Video,
          as: 'videos',
           include: [
            {
              model: PostComment, 
              as: 'comments', 
            },
          ],
        },
      ],
    });

    if (userVideos) {
      const videos = userVideos.videos;
      
      const viewCounts = await Promise.all(videos.map(async (video) => {
        const viewCount = await VideoView.count({
          where: { video_id: video.id },
        });
        const comments = video.comments;
        return { ...video.dataValues, viewCount,comments };
      }));

      res.json(viewCounts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ message: 'Error fetching user videos' });
  }
};

const sendGifts = async (req, res, next) => {
  logger.info("*******SENDING GIFTS*******")
  try {
    const {
      diamonds,
      video_id,
      reciever_id,
    } = req.body;
    const { id, email } = req.userData;
    const sender_id = id;
    const userIdToUpdate = id;
    const additionalWalletValue = diamonds;


    let sended_gifts = await Gift.create({
      diamonds,
      video_id,
      reciever_id,
      sender_id
    })

    sended_gifts = JSON.parse(JSON.stringify(sended_gifts));
    if (!sended_gifts) throw errorHandler("Unexpected error occured while creating user!", "badRequest");
    async function updateUserWallet(userId, additionalWalletValue) {
      try {
        const user = await User.findByPk(userId);
        if (!user) {
          console.log('User not found');
          return;
        }
        const currentWalletValue = user.wallet || 0;
        const newWalletValue = currentWalletValue - additionalWalletValue;
        let updated_wallet = await user.update({ wallet: newWalletValue });
        updated_wallet = JSON.parse(JSON.stringify(updated_wallet));

        const reciever_video = await Video.findByPk(video_id)
        if (!user) {
          logger.error('video not found');
          return;
        }
        const currentVideoWalletValue = reciever_video.diamond_value || 0;
        const newVideoWalletValue = currentVideoWalletValue + diamonds;
        let updated_video_wallet = await Video.update(
          { diamond_value: newVideoWalletValue },
          {
            where: { id: video_id, },
          });
        updated_video_wallet = JSON.parse(JSON.stringify(updated_video_wallet));


        res.status(201).json({
          message: 'successfull sended',
          ...updated_wallet,
          ...sended_gifts
        })
        console.log(updated_video_wallet)

        console.log('User wallet updated successfully!');
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    updateUserWallet(userIdToUpdate, additionalWalletValue);


  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error while sending gifts, Please try after some time' })
  }
}



















module.exports = {
  getUsers,
  deleteUsers,
  updateUserActiveStatus,
  getBlockedUsers,
  updateUserStatus,
  getUsersVideo,
  sendGifts,
  getBasicUsers,
  getPremiumUsers

};
