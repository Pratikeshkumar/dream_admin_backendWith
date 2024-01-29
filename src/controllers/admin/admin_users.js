// all users
// basic user
// premium user
// business user
// reported user
// reported user
// blocked user


const logger = require("../../utils/logger");
const { User, Video, UserInteraction, VideoView, PostComment, PicturePost, Like, Gift } = require("../../models");
const { Sequelize, Op } = require('sequelize');
const videoshare = require('../../models/video_share')
const { param } = require("../../routes/users");


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



// const getBasicUsers = async (req, res) => {
//   logger.info("INFO -> GETTING BasicUSERS API CALLED");
//   try {
//     // Retrieve all users without pagination

//     const users = await User.findAll({
//       where: {
//         account_type: 'basic',
//       },
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
const getBasicUsers = async (req, res) => {
  logger.info("INFO -> GETTING BasicUSERS API CALLED");

  const page = req.query.page || 1; // Default to page 1 if not specified
  const itemsPerPage = 10; // Number of users per page
  const searchQuery = req.query.search || ''; // Get the search term from the query parameters
  const offset = (page - 1) * itemsPerPage;

  try {
    let whereCondition = {}; // Define an empty object for the WHERE condition
    if (searchQuery !== '') {
      whereCondition = {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${searchQuery}%` } },
          { email: { [Sequelize.Op.like]: `%${searchQuery}%` } }
        ]
      };
    }
    const users = await User.findAll({
      where: {
        account_type: 'basic',
      },
      where: whereCondition, // Apply the WHERE condition for filtering
      offset,
      limit: itemsPerPage,
    });

    const totalUsers = await User.count({
      where: {
        account_type: 'basic',
      },
    });

    const response = {
      message: "Users retrieved successfully",
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / itemsPerPage),
        totalUsers,
        itemsPerPage,
      },
    };
    // console.log(response.pagination,'paginationpagination')
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Error generated while processing your request",
      error: error.message,
    });
  }
};






// const getPremiumUsers = async (req, res) => {
//   logger.info("INFO -> GETTING BasicUSERS API CALLED");
//   try {
//     // Retrieve all users without pagination
//     const users = await User.findAll({
//       where: {
//         account_type: 'premium',
//       },
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







// const updateUserActiveStatus = async (req, res) => {
//   const userId = req.params.id;
//   const newActiveStatus = req.body.isActive;
//   console.log(newActiveStatus, "newActiveStatus")

//   try {
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update the user's active status
//     user.active = newActiveStatus;
//     await user.save();

//     return res.status(200).json(user); // You can return the updated user object if needed.
//   } catch (error) {
//     console.error('Error updating user active status:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };


const updateUserActiveStatus = async (req, res) => {
  const userId = req.params.id;
  const newActiveStatus = req.body.isActive;
  const userRole = req.userData.role;
  console.log(userRole)
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine blocking duration based on the user's role
    let blockDurationInDays = 0;

    switch (userRole) {
      case 'superadmin':
        blockDurationInDays = 30;
        break;
      case 'admin':
        blockDurationInDays = 15;
        break;
      case 'manager':
        blockDurationInDays = 3;
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role' });
    }

    // Check if the user is already blocked
    if (user.active === 0) {
      return res.status(400).json({ error: 'User is already blocked' });
    }

    // Set the active status to 0 (blocked) or 1 (active) based on req.body.isActive
    user.active = newActiveStatus;

    await user.save();

    // If blocking the user, schedule a task to unblock the user after the specified duration
    if (!newActiveStatus) {
      setTimeout(async () => {
        user.active = 1; // Set the active status to unblock the user
        await user.save();
        console.log(`User ${user.id} unblocked.`);
      }, blockDurationInDays * 24 * 60 * 60 * 1000);
    }

    return res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user active status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = updateUserActiveStatus;






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

const getPremiumUsers = async (req, res) => {
  logger.info("Premium API Called")
  const page = req.query.page || 1
  const itemsPerPage = 4;
  const searchQuery = req.query.search || ''; // Get the search term from the query parameters
  // console.log(page,'page')
  try {
    let searchcondition = {}
    if (searchQuery !== '') {
      searchcondition = {
        [Sequelize.op.or]: [
          { email: { [Sequelize.Op.like]: `%${searchQuery}%` } }]
      }
    }
    const offset = (page - 1) * itemsPerPage;
    const users = await User.findAll({
      where: {
        account_type: 'premium',
        ...searchcondition, // Combine both conditions into a single object
      },
      offset,
      limit: itemsPerPage,
    });
    const totalUsers = await User.count({
      where: {
        account_type: 'premium',
        ...searchcondition, // Combine both conditions into a single object
      },
    });
    // console.log(totalUsers,'totalUsers',page,'page',itemsPerPage,'itemsPerPage')

    // Prepare response data
    const response = {
      data: users,
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
    console.error("Error fetching premium user", error);
    res.status(500).json({ error: "Internal Server Error" })
  }
}






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
        return { ...video.dataValues, viewCount, comments };
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


// const get_user_photo_post = async (req, res) => {
//   try {
//     const post = await PicturePost.findAll({
//       order: [['createdAt', 'DESC']],
//     });
//     res.status(200).json({
//       post,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error generating the response' });
//   }
// };
const get_user_photo_post = async (req, res) => {
  try {
    console.log(req.params.user_id, "reqBody")
    const user_id = req.params.user_id; // Assuming you pass the user ID in the URL parameters

    const photos = await PicturePost.findAll({
      where: {
        user_id: user_id,
      },
      order: [['createdAt', 'DESC']],
    });
// console.log(photos,'photosphotosphotos')
    res.status(200).json({
      photos: photos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating the response' });
  }
};



const changeUserAccount_type = async (req, res) => {
  try {

    const userId = req.params.id;

    const { account_type } = req.body;
    console.log(userId, account_type, "checking")

    // Find the user by ID
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the account type
    existingUser.account_type = account_type;

    // Save the updated user to the database
    await existingUser.save();

    res.status(200).json({ message: 'Account type updated successfully', data: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
}
//get like according to time 



const getLikeinteraction = async (req, res) => {
  logger.info("INFO -> Like interaction API CALLED");
  try {
    // const { id } = req.userData;
    const id = req.params.user_id;
    console.log(id, 'req.params.user_id')
    const currentDate = new Date();

    // Calculate start dates for different time ranges
    const startDate15Days = new Date(currentDate);
    startDate15Days.setDate(currentDate.getDate() - 15);

    const startDate30Days = new Date(currentDate);
    startDate30Days.setDate(currentDate.getDate() - 30);

    const startDate90Days = new Date(currentDate);
    startDate90Days.setDate(currentDate.getDate() - 90);

    const result15Days = await getLikeData(id, startDate15Days, currentDate);
    const result30Days = await getLikeData(id, startDate30Days, currentDate);
    const result90Days = await getLikeData(id, startDate90Days, currentDate);
    const totalLikes15Days = result15Days.reduce((total, item) => total + item.dataValues.total_like, 0);
    const totalLikes30Days = result30Days.reduce((total, item) => total + item.dataValues.total_like, 0);
    const totalLikes90Days = result90Days.reduce((total, item) => total + item.dataValues.total_like, 0);

// console.log(totalLikes15Days,'totalLikes15Days')
// console.log(totalLikes30Days,'totalLikes30Days')
// console.log(totalLikes90Days,'totalLikes90Days')

    // console.log(totalLikes15Days,'result15Days')
    res.status(201).json({
      message: "success",
      payload: {
        "fifteen_days": totalLikes15Days,
        "thirty_days": totalLikes30Days,
        "ninty_days": totalLikes90Days,
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "error while fetching Like intraction, please try again" });
  }
};

const getLikeData = async (userId, startDate, endDate) => {
  return await Like.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "total_like"],
    ],
    where: {
      reciever_id: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],
  });
};

//seender like data

const getsenderlikedata=async(req,res)=>{
  logger.info("INFO -> Sender Like interaction API CALLED");
  try{
    const userID=req.params.user_id
    const currentDate=new Date()

    const startDate15Days=new Date(currentDate)
    startDate15Days.setDate(currentDate.getDate()-15);
    const startDate30Days=new Date(currentDate)
    startDate30Days.setDate(currentDate.getDate()-30);
    const startDate90Days=new Date(currentDate)
    startDate90Days.setDate(currentDate.getDate()-90)

    const result15Days=await Senderlike(userID,startDate15Days,currentDate);
    const result30Days=await Senderlike(userID,startDate30Days,currentDate);
    const result90Days=await Senderlike(userID,startDate90Days,currentDate);

    const totalsendlike15Days=result15Days.reduce((total,item)=>total+ item.dataValues.total_send_like,0);
    const totalsendlike30Days=result30Days.reduce((total,item)=>total+ item.dataValues.total_send_like,0);
    const totalsendlike90Days=result90Days.reduce((total,item)=>total+ item.dataValues.total_send_like,0)
    // console.log(totalsendlike15Days,'result15Days sender')
    // console.log(totalsendlike30Days,'result30Days sender')
    // console.log(totalsendlike90Days,'result90Days sender')

    res.status(201).json({
      message: "success",
      payload: {
        "fifteen_days": totalsendlike15Days,
        "thirty_days": totalsendlike30Days,
        "ninty_days": totalsendlike90Days,
      },
    });
  }catch(error){
    logger.info(error)
    return res.status(500).json({message:"error while fetching User Send Like intraction, please try again"})
  }

}

const Senderlike=async(userId,startDate,endDate)=>{
  return await Like.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "total_send_like"],
    ],
    where: {
      sender_id: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],
  });
}




const getPostCommentInteraction = async (req, res) => {
  logger.info("INFO -> Post Comment Interaction API CALLED");
  try {
    const userId = req.params.user_id;
    console.log(userId, 'req.params.user_id');

    const currentDate = new Date();

    // Calculate start dates for different time ranges
    const startDate15Days = new Date(currentDate);
    startDate15Days.setDate(currentDate.getDate() - 15);

    const startDate30Days = new Date(currentDate);
    startDate30Days.setDate(currentDate.getDate() - 30);

    const startDate90Days = new Date(currentDate);
    startDate90Days.setDate(currentDate.getDate() - 90);

    const result15Days = await getPostCommentData(userId, startDate15Days, currentDate);
    const result30Days = await getPostCommentData(userId, startDate30Days, currentDate);
    const result90Days = await getPostCommentData(userId, startDate90Days, currentDate);

    const totalComments15Days = result15Days.reduce((total, item) => total + item.dataValues.total_comments, 0);
    const totalComments30Days = result30Days.reduce((total, item) => total + item.dataValues.total_comments, 0);
    const totalComments90Days = result90Days.reduce((total, item) => total + item.dataValues.total_comments, 0);
    console.log(totalComments15Days, 'totalComments15Days')
    res.status(201).json({
      message: "success",
      payload: {
        "fifteen_days": totalComments15Days,
        "thirty_days": totalComments30Days,
        "ninty_days": totalComments90Days,
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "error while fetching Post Comment intraction, please try again" });
  }
};








const getPostCommentData = async (userId, startDate, endDate) => {
  return await PostComment.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "total_comments"],
    ],
    where: {
      user_id: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],
  });
};

// recived comment
const getrecivedcomment=async(req,res)=>{
 logger.info("INFO -Recived Comment API called")
 try{
  const userID = req.params.user_id;
  const currentDate = new Date();

  // Calculate start dates for different time ranges
  const startDate15Days = new Date(currentDate);
  startDate15Days.setDate(currentDate.getDate() - 15);

  const startDate30Days = new Date(currentDate);
  startDate30Days.setDate(currentDate.getDate() - 30);

  const startDate90Days = new Date(currentDate);
  startDate90Days.setDate(currentDate.getDate() - 90);

  const result15Days = await recivedcomment(userID, startDate15Days, currentDate);
  const result30Days = await recivedcomment(userID, startDate30Days, currentDate);
  const result90Days = await recivedcomment(userID, startDate90Days, currentDate);
  const totalComments15Days = result15Days.reduce((total, item) => total + item.dataValues.total_received_comments, 0);

  const totalComments30Days = result30Days.reduce((total, item) => total + item.dataValues.total_received_comments, 0);

  const totalComments90Days = result90Days.reduce((total, item) => total + item.dataValues.total_received_comments, 0);

// console.log(result90Days,'result90Dats recived comment')
// console.log(result15Days,'result15Dats recived comment')
// console.log(result30Days,'result30Dats recived comment')
// console.log(totalComments90Days,'result90Dats recived comment')
// console.log(totalComments30Days,'result30Dats recived comment')
// console.log(totalComments15Days,'result150Dats recived comment')


// console.log('startDate15Days:', startDate15Days);
// console.log('enddate:', currentDate);

// console.log(userID,'userID')
res.status(201).json({
  message: "success",
  payload: {
    "fifteen_days": totalComments15Days,
    "thirty_days": totalComments30Days,
    "ninty_days": totalComments90Days,
  },
});

 }catch(error){
  logger.info(error)
  return res.status(500).json({message:"error while fetching recived comment , please try again"})
 }
}

const recivedcomment=async(userID,startDate,endDate)=>{
   const videos=await Video.findAll({
    attributes: ["id"],
    where: {
      user_id: userID,
      // created: {
      //   [Op.between]: [new Date(startDate), new Date(endDate)],
      // },
    },


   })
   const videoIds = videos.map((video) => video.id);
   
   return await PostComment.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],


      [Sequelize.fn("COUNT", Sequelize.col("id")), "total_received_comments"],
    ],
    where: {
      video_id: videoIds,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },

    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],


  });

}
///Diamond


const getdiamondinteraction = async (req, res) => {
  logger.info("INFO -> Diamond Interaction API CALLED");
  try {
    const userId = req.params.user_id;
    console.log(userId, 'req.params.user_id');

    const currentDate = new Date();

    // Calculate start dates for different time ranges
    const startDate15Days = new Date(currentDate);
    startDate15Days.setDate(currentDate.getDate() - 15);

    const startDate30Days = new Date(currentDate);
    startDate30Days.setDate(currentDate.getDate() - 30);

    const startDate90Days = new Date(currentDate);
    startDate90Days.setDate(currentDate.getDate() - 90);

    const result15Days = await getdiamondData(userId, startDate15Days, currentDate);
    const result30Days = await getdiamondData(userId, startDate30Days, currentDate);
    const result90Days = await getdiamondData(userId, startDate90Days, currentDate);

    const totalDiamond15Days = result15Days.reduce((total, item) => total + parseInt(item.dataValues.totalCoins), 0);
    const totalDiamond30Days = result30Days.reduce((total, item) => total + parseInt(item.dataValues.totalCoins), 0);
    const totalDiamond90Days = result90Days.reduce((total, item) => total + parseInt(item.dataValues.totalCoins), 0);
    


    res.status(201).json({
      message: "success",
      payload: {
        "fifteen_days": totalDiamond15Days,
        "thirty_days": totalDiamond30Days,
        "ninty_days": totalDiamond90Days,
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "error while fetching diamond intraction, please try again" });
  }
};

const getdiamondData = async (userId, startDate, endDate) => {
  return await Gift.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("SUM", Sequelize.col("diamonds")), "totalCoins"],

    ],
    where: {
      reciever_id: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],
  });
};

const getshareintraction = async (req, res) => {
  logger.info("INFO -> Share Interaction API CALLED");
  try {
    const userID = req.params.user_id;
    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 2);
    // // console.log(currentDate,'currentDate')
    //     // Corrected date calculations
    const startDate15Days = new Date(currentDate);
    startDate15Days.setDate(currentDate.getDate() - 15);

    const startDate30Days = new Date(currentDate);
    startDate30Days.setDate(currentDate.getDate() - 30);

    const startDate90Days = new Date(currentDate);
    startDate90Days.setDate(currentDate.getDate() - 90);

    const result15Days = await getshare(userID, startDate15Days, currentDate);
    const result30Days = await getshare(userID, startDate30Days, currentDate);
    const result90Days = await getshare(userID, startDate90Days, currentDate);
    const totalshare15Days = result15Days.reduce((total, item) => total + parseInt(item.dataValues.totalshared), 0);
    const totalshare30Days = result30Days.reduce((total, item) => total + parseInt(item.dataValues.totalshared), 0);
    const totalshare90Days = result90Days.reduce((total, item) => total + parseInt(item.dataValues.totalshared), 0);

    // console.log(totalshare15Days, 'totalshare15Days');
    // console.log(totalshare30Days, 'totalshare30Days');
    // console.log(totalshare90Days, 'totalshare90Days');
    // console.log(result15Days, 'totalshare15Days');
    // console.log(result30Days, 'totalshare30Days');
    // console.log(result90Days, 'totalshare90Days');

    // console.log(userID, 'userID')
    res.status(200).json({
      message: "success",
      payload: {
        fifteen_days: totalshare15Days,
        thirty_days: totalshare30Days,
        ninty_days: totalshare90Days,
      },
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Error while fetching share interaction, please try again" });
  }
};



const getshare = async (userID, startDate, endDate) => {
  return await videoshare.findAll({
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'day'],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalshared"],
    ],
    where: {
      user_id: userID,
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn('DATE', Sequelize.col('timestamp'))],
  });
};


const getsenderdiamond = async (req, res) => {
  logger.info("INFO -> Sender Diamond info  API CALLED")
  try {
    const userID = req.params.user_id;
    const currentDate = new Date()
    const startDate15Days = new Date(currentDate)
    startDate15Days.setDate(currentDate.getDate() - 15);

    const startDate30Days = new Date(currentDate)
    startDate30Days.setDate(currentDate.getDate() - 30);

    const startDate90Days = new Date(currentDate)
    startDate90Days.setDate(currentDate.getDate() - 90);

  const result15Days=await Senderdiamond(userID,startDate15Days,currentDate)
  const result30Days=await Senderdiamond(userID,startDate30Days,currentDate)
  const result90Days=await Senderdiamond(userID,startDate90Days,currentDate)

  const totalsenderdiamond15Days=result15Days.reduce((total,item)=>total + parseInt(item.dataValues.totalCoinssend), 0);
  const totalsenderdiamond30Days=result30Days.reduce((total,item)=>total+ parseInt(item.dataValues.totalCoinssend),0);
  const totalsenderdiamond90Days=result90Days.reduce((total,item)=>total + parseInt(item.dataValues.totalCoinssend),0);
  // console.log(totalsenderdiamond15Days,'result15Days send diamond')
  // console.log(totalsenderdiamond30Days,'totalsenderdiamond30Days send diamond')
  // console.log(totalsenderdiamond90Days,'totalsenderdiamond90Days send diamond')


  res.status(200).json({
    message: "success",
    payload: {
      fifteen_days: totalsenderdiamond15Days,
      thirty_days: totalsenderdiamond30Days,
      ninty_days: totalsenderdiamond90Days,
    },
  });
  } catch (error) {
    logger.info(error)
    return res.status(500).json({ message: 'Error while fetching Send Diamond interaction, please try again' })
  }
}

const Senderdiamond=async(userID,startDate,endDate)=>{
  return await Gift.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("SUM", Sequelize.col("diamonds")), "totalCoinssend"],

    ],
    where: {
      sender_id: userID,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m-%d")],
  })

}




const getrecivedshare=async(req,res)=>{
  logger.info(" Recived Share API Called ")
  try{
    const userID = req.params.user_id;
    const currentDate=new Date()
    const startDate15Days = new Date(currentDate)
    startDate15Days.setDate(currentDate.getDate() - 15);
    const startDate30Days=new Date(currentDate)
    startDate30Days.setDate(currentDate.getDate()-30)
    const startDate90Days=new Date(currentDate)
    startDate90Days.setDate(currentDate.getDate()-90)

    const result15Days=await recivedShare(userID,startDate15Days,currentDate)
    const result30Days=await recivedShare(userID,startDate30Days,currentDate)
    const result90Days=await recivedShare(userID,startDate90Days,currentDate)
   
    const totalrecivedshare15Days=result15Days.reduce((total,item)=>total + parseInt(item.dataValues.totalReceivedShare), 0);
     const totalrecivedshare30Days=result30Days.reduce((total,item)=>total + parseInt(item.dataValues.totalReceivedShare),0);
     const totalrecivedshare90Days=result90Days.reduce((total,item)=>total + parseInt(item.dataValues.totalReceivedShare),0)
     console.log(userID,'userID')
    // console.log(totalrecivedshare15Days,'totalrecivedshare15Days')
    // console.log(totalrecivedshare30Days,'totalrecivedshare30Days')
    // console.log(totalrecivedshare30Days,'totalrecivedshare30Days')
    res.status(200).json({
      message: "success",
      payload: {
        fifteen_days: totalrecivedshare15Days,
        thirty_days: totalrecivedshare30Days,
        ninty_days: totalrecivedshare90Days,
      },
    });

  
  }catch(error){
   logger.info(error)
   return res.status(500).json({message: 'Error while fetching recive share, please try again'})
  }
}


const recivedShare = async (userID, startDate, endDate) => {
  return await videoshare.findAll({
    attributes: [
      [Sequelize.fn("DATE_FORMAT", Sequelize.col("timestamp"), "%Y-%m-%d"), "day"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReceivedShare"],
    ],
    where: {
      shared_people_id: userID,
      timestamp: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("timestamp"), "%Y-%m-%d")],
  });
};


module.exports = {
  getUsers,
  deleteUsers,
  updateUserActiveStatus,
  getBlockedUsers,
  updateUserStatus,
  getUsersVideo,
  sendGifts,
  getBasicUsers,
  getPremiumUsers,
  get_user_photo_post,
  changeUserAccount_type,
  getLikeinteraction,
  getPostCommentInteraction,
  getdiamondinteraction,
  getshareintraction,
  getsenderdiamond,
  getsenderlikedata,
  getrecivedcomment,
  getrecivedshare

};
