const {
  User,
  Avatar,
  Transaction,
  Gift,
  Video,
  UserRelationship,
  Like,
  Message,
  UserInteraction,
  Language,
  Hobbies,
  VideoView,
  ProfileVisit,
  Occupations,
  VideoReport,
  UserToUserBlock,
  UserToUserFavourite,
} = require("../../models");
const fs = require('fs');
const errorHandler = require("../../utils/errorObject");
const { JWT_KEY } = process.env;
const logger = require('../../utils/logger');
const jwt = require("jsonwebtoken");
const cloudinary = require('../../config/cloudinary');
const { Op, literal } = require('sequelize');
const sequelize = require('sequelize')
const { s3 } = require('../../config/aws');
const { admin } = require('../../../firebaseAdmin')
const uuid = require('uuid')



const signup = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: SIGN UP API CALLED");
  try {
    let { name, email, firebase_uid, profile_pic } = req.body;
    let ip = req.ip;
    const extractedIP = ip.split(':').pop();
    let user = await User.findOne({
      where: { email }
    });

    if (user) throw errorHandler("User already exists!", "duplication");

    // creating username from email
    const part = email.split('@')
    let username = part[0]

    let created_user = await User.create({
      nickname: name,
      username: username,
      ip: extractedIP,
      email: email,
      role: "user",
      active: true,
      firebase_uid: firebase_uid,
      wallet: 0,
      profile_pic: profile_pic
    });

    created_user = JSON.parse(JSON.stringify(created_user));
    if (!created_user) throw errorHandler("Unexpected error occured while creating user!", "badRequest");
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      payload: {
        ...created_user,
        auth_token: jwt.sign({ email: created_user.email, username: created_user.username }, JWT_KEY),
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const userExist = async (req, res, next) => {
  logger.info('**********USER EXISTANCE CHECKING******')
  try {
    const { email } = req.body;
    let user = await User.findOne({
      where: { email }
    })

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'user exist',

      })
    }

  } catch (error) {
    logger.error(error)
  }

}










const login = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: LOGIN UP API CALLED");
  try {
    let {
      email
    } = req.body,
      condition = {
        email
      };
    let user = await User.findOne({
      where: condition
    });
    user = JSON.parse(JSON.stringify(user));

    if (!user) return res.json({
      message: 'user not found'
    })

    return res.status(201).json({
      success: true,
      message: "Logged-in successfully",
      payload: {
        ...user,
        auth_token: jwt.sign({ email: user.email, username: user.username }, JWT_KEY),
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};


const getAvatar = async (req, res, next) => {
  logger.info("VESRION 2.0 -> USER: GET AVATAR LIST FROM DB")
  try {
    let avatar = await Avatar.findAll()
    avatar = JSON.parse(JSON.stringify(avatar))
    if (!avatar) throw errorHandler("avatar are present")

    return res.status(201).json({
      success: true,
      message: 'avtar fetched successfully',
      payload: avatar
    })

  } catch (error) {
    logger.error("getting error while fetching the avatar list from db")
    return next(error)
  }
}









const userInfo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: GET USER INFO API CALLED");
  try {
    let { id, email } = req.userData;

    let user = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: { id, email }
    });

    user = JSON.parse(JSON.stringify(user))
    if (!user) throw errorHandler("User not found", "notFound");
    return res.status(200).json({
      success: true,
      message: "User info fetched successfully!",
      payload: {
        ...user,
        auth_token: jwt.sign({ email: user.email, username: user.username }, JWT_KEY),
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};


const userInfoById = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: GET OTHER USER INFO BY ID API CALLED");
  try {
    let { user_id } = req.params;

    let user = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: { id: user_id },
      include: [
        {
          model: Video,
          as: 'videos',
          attributes: ['id', 'description', 'video', 'thum', 'view', 'diamond_value', 'like', 'view', 'created'],
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'Following',
          attributes: ['id', 'username'],
        },
      ],
    });
    if (!user) throw errorHandler("User not found", "notFound");

    let liked_video = await Like.findAll({
      where: { sender_id: user_id },
      include: [
        {
          model: Video,
          as: 'video',
          attributes: ['id', 'description', 'video', 'thum', 'view', 'diamond_value', 'like', 'view', 'created'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username'],
        },
      ],
    });
    return res.status(200).json({ user, liked_video });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};






const updateUser = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: USER UPDATE API CALLED");
  try {
    let data = req.body,
      { id, email } = req.userData;

    await User.update(
      data,
      { where: { id, email } }
    );

    let user = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id, email
      }
    });
    user = JSON.parse(JSON.stringify(user));

    return res.status(200).json({
      success: true,
      message: "User info updated successfully!",
      payload: user
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const uploadData = async (req, res, next) => {
  logger.info("VERSION 2.0 -> USER: UPLOAD DATA API CALLED");
  try {
    let path = req?.files?.source[0]?.path;

    if (!path) throw errorHandler("data is not present in body", "badRequest");

    let uploadedVideo = await cloudinary.uploads(path, "SocialMedia"),
      url = uploadedVideo.url;

    fs.unlinkSync(path);

    res.status(201).json({
      success: true,
      message: "Data uploaded successfully!",
      payload: {
        url
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const storePayments = async (req, res, next) => {
  logger.info("******* USER TRANSACTION STORED *******")
  try {
    const {
      payment_id,
      link,
      country_code,
      email_address,
      first_name,
      last_name,
      payer_id,
      account_id,
      account_status,
      amount_value,
      currency_code,
      reference_id,
      status,
      address_line_1,
      admin_area_1,
      admin_area_2,
      postal_code,
      dimanond_value
    } = req.body;

    const { id, email } = req.userData;
    const user_id = id
    const userIdToUpdate = id;
    const additionalWalletValue = dimanond_value;

    let result = await Transaction.create({
      user_id,
      payment_id,
      link,
      country_code,
      email_address,
      first_name,
      last_name,
      payer_id,
      account_id,
      account_status,
      amount_value,
      currency_code,
      reference_id,
      status,
      address_line_1,
      admin_area_1,
      admin_area_2,
      postal_code,
      dimanond_value
    })
    result = JSON.parse(JSON.stringify(result));
    if (!result) throw errorHandler("Unexpected error occured while creating user!", "badRequest");

    async function updateUserWallet(userId, additionalWalletValue) {
      try {
        const user = await User.findByPk(userId);
        if (!user) {
          console.log('User not found');
          return;
        }
        const currentWalletValue = user.wallet || 0;
        const newWalletValue = currentWalletValue + additionalWalletValue;
        let updated_wallet = await user.update({ wallet: newWalletValue });
        updated_wallet = JSON.parse(JSON.stringify(updated_wallet));

        res.status(201).json({
          message: 'transaction_successfull',
          ...updated_wallet
        })

        console.log('User wallet updated successfully!');
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    updateUserWallet(userIdToUpdate, additionalWalletValue);

  } catch (error) {
    logger.error(error)
  }
}

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

const follow = async (req, res, next) => {
  logger.info("INFO - USER FOLLOW API CALLED");
  try {
    let { receiver_id } = req.body;
    const { id } = req.userData;
    let sender_id = id;

    const result = await UserRelationship.create({
      sender_id,
      receiver_id
    });

    res.status(201).json({
      message: 'success',
      result // Sending the result object directly in the response
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};


const unfollow = async (req, res, next) => {
  logger.info("INFO - USER UNFOLLOW API CALLED");
  try {
    let { receiver_id } = req.body;
    const { id } = req.userData;
    let sender_id = id;

    const relationship = await UserRelationship.findOne({
      where: { sender_id, receiver_id }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found. User may not be following.' });
    }

    await UserRelationship.destroy({
      where: { sender_id, receiver_id }
    });

    res.status(200).json({ message: 'Unfollowed successfully.' });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};


const getFollowersDetails = async (req, res, next) => {
  logger.info("INFO - USER FOLLOWERS DETAILS API CALLED");
  try {
    const { user_id } = req.params;
    let user = await User.findByPk(user_id, {
      include: [
        {
          model: User,
          as: 'Followers',
          through: UserRelationship,
          attributes: ['id', 'nickname', 'profile_pic', 'username'],
        },
      ],
    });
    if (!user) throw errorHandler("User does not have any followers", "no followers");

    user = JSON.parse(JSON.stringify(user));
    res.status(201).json({
      ...user
    })



  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'An error occurred. Please try again later.' })
  }
}



const getFollowingsDetails = async (req, res, next) => {
  logger.info("INFO - USER FOLLOWINGS DETAILS API CALLED");
  try {
    const { user_id } = req.params;
    let user = await User.findByPk(user_id, {
      include: [
        {
          model: User,
          as: 'Following',
          through: UserRelationship,
          attributes: ['id', 'nickname', 'profile_pic', 'username'],
        },
      ],
    });
    if (!user) throw errorHandler("User does not have any followings", "no followigs");

    user = JSON.parse(JSON.stringify(user));
    res.status(201).json({
      ...user
    })


  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'An error occurred. Please try again later.' })
  }
}

const getAllMessages = async (req, res, next) => {
  logger.info('INFO -> GET ALL MESSAGES API CALLED');
  try {
    const { chatedPerson } = req.params;
    const { id } = req.userData;
    const senderId = id;
    const receiverId = chatedPerson;

    let messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'nickname', 'profile_pic'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const giftedChatMessages = messages.map((message) => {
      return {
        _id: message.id.toString(), // Convert the ID to a string
        text: message.text,
        type: 'text',
        createdAt: message.createdAt,
        user: {
          _id: message.sender.id.toString(),
          name: message.sender.nickname,
          avatar: message.sender.profile_pic,
        },

      };
    });

    res.status(200).json({
      messages: giftedChatMessages,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'An error occurred while getting your messages. Please try again later.',
    });
  }
};


const getMyAllChatedPerson = async (req, res) => {
  logger.info('INFO -> GET MY ALL CHATED API CALLED');
  try {
    const { id } = req.userData;


    const uniqueUsers = await getUniqueUsers(id);
    res.status(201).json({ uniqueUsers });
  } catch (error) {
    logger.error('Error fetching unique users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const getUniqueUsers = async (userId) => {
  try {
    const uniqueUsers = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      attributes: ['senderId', 'receiverId'],
    });

    const userSet = new Set();

    uniqueUsers.forEach((msg) => {
      if (msg.senderId !== userId) {
        userSet.add(msg.senderId);
      }
      if (msg.receiverId !== userId) {
        userSet.add(msg.receiverId);
      }
    });

    const uniqueArr = Array.from(userSet);

    const uniqueChatedPeople = await User.findAll({
      where: { id: uniqueArr },
      attributes: ['id', 'nickname', 'profile_pic', 'username'],
    });

    return JSON.parse(JSON.stringify(uniqueChatedPeople))
  } catch (error) {
    console.error('Error retrieving unique users:', error);
    throw error;
  }
};

const getAllFollowingsUsers = async (req, res) => {
  logger.info('INFO -> ALL FOLLOWINGS USERS API CALLED')
  try {
    const { id } = req.userData;

    let user = await User.findAll({
      where: { id },
      include: {
        model: User,
        as: 'Following',
        attributes: ['id', 'nickname', 'username', 'profile_pic']
      }
    })
    if (!user) throw errorHandler("User have not following anyone. Please follow someone to continue")

    user = JSON.parse(JSON.stringify(user))

    res.status(201).json({
      message: 'success',
      payload: user
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error while fetching the user followings details, Please try again after some time' })
  }

}

const addUserInteractionTime = async (req, res) => {
  logger.info('INFO -> ADDING INTERACTION API CALLED')
  try {
    const { id } = req.userData;
    const {
      interaction_start,
      interacted_time
    } = req.body;



    let result = await UserInteraction.create({
      user_id: id,
      interaction_start,
      interacted_time
    })
    if (!result) throw errorHandler('error while creating the user interaction')
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      message: 'success',
      payload: result
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error while adding data. Please try again after time', error })
  }
}

const changeProfilePicture = async (req, res) => {
  logger.info('INFO -> PROFILE PICTURE CHANGING API CALLED')
  try {
    const { id } = req.userData;
    const image = req.files['images'] ? req.files['images'][0].originalname : null
    const imagePath = req.files['images'] ? req.files['images'][0].path : null
    // uploading image to aws bucket
    const uploadPicture = {
      Bucket: 'dreamapplication',
      Key: `images/${image}`,
      Body: fs.createReadStream(imagePath)
    };
    const uri = `https://dpcst9y3un003.cloudfront.net/images/${image}`
    const [updatedRows] = await User.update(
      { profile_pic: uri },
      { where: { id } }
    );
    res.status(200).json({
      message: 'success'
    })
    s3.upload(uploadPicture, (err, data) => {
      if (err) {
        logger.error('Error uploading picture:', err);
      } else {
        logger.info('picture uploaded successfully:', data.Location);
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local profile file:', unlinkErr);
          } else {
            logger.info('Local images file deleted:', imagePath);
          }
        });
      }
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error generated while changing the profile picture', error })
  }
}


const changeProfileVideo = async (req, res) => {
  logger.info('INFO -> PROFILE VIDEO CHANGING API CALLED')
  try {
    const { id } = req.userData;
    const videos = req.files['videos'] ? req.files['videos'][0].originalname : null
    const videoPath = req.files['videos'] ? req.files['videos'][0].path : null

    const uploadVideo = {
      Bucket: 'dreamapplication',
      Key: `images/${videos}`,
      Body: fs.createReadStream(videoPath)
    };

    const uri = `https://dpcst9y3un003.cloudfront.net/images/${videos}`

    console.log(uri)
    const [updatedRows] = await User.update(
      { profile_video: uri },
      { where: { id } }
    );
    res.status(200).json({
      message: 'success'
    })

    s3.upload(uploadVideo, (err, data) => {
      if (err) {
        logger.error('Error uploading profile video:', err);
      } else {
        logger.info('profile video uploaded successfully:', data.Location);
        fs.unlink(videoPath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local profile video file deleted:', videoPath);
          }
        });
      }
    });

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error generated while changing the profile video', error })
  }
}


const checkUsernameAvaliable = async (req, res) => {
  logger.info('INFO -> USERNAME AVAILABLE API CALLED');
  try {
    const { value } = req.params;

    // Check if a user with the given username exists
    const user = await User.findOne({
      where: {
        username: value
      }
    });

    if (user) {
      // Username is not available
      res.json({
        message: 'Username is not available',
        available: false
      });
    } else {
      // Username is available
      res.json({
        message: 'Username is available',
        available: true
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error occurred while checking the username availability',
      error
    });
  }
};




const getLanguageAllLanguageList = async (req, res) => {
  logger.info('INFO -> GETTING ALL LIST OF LANGUAGE DATA API CALLED')
  try {
    const { page_no, page_size } = req.params;

    const pageNo = parseInt(page_no);
    const pageSize = parseInt(page_size);

    // Calculate the offset for pagination
    const offset = (pageNo - 1) * pageSize;

    // Query the database with limit and offset for pagination
    const language_result = await Language.findAll({
      limit: pageSize,
      offset: offset,
    });

    // Return paginated results
    res.json({
      message: 'Successfully retrieved the list of data',
      data: language_result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error occurred while getting the list of data',
      error: error.message,
    });
  }
};


const searchLanguage = async (req, res) => {
  logger.info('INFO -> SEARCHING LANGUAGE API CALLED');
  try {
    const { search_text } = req.params;
    const result = await Language.findAll({
      where: {
        name: {
          [Op.like]: `${search_text}%`,
        },
      },
      attributes: ['id', 'name']
    });

    res.status(200).json({
      message: 'Languages found successfully',
      data: result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error generated while searching languages',
      error,
    });
  }
};



const getAllHobbiesList = async (req, res) => {
  logger.info('INFO -> GETTING ALL LIST OF HOBBIES DATA API CALLED')
  try {
    const { page_no, page_size } = req.params;

    const pageNo = parseInt(page_no);
    const pageSize = parseInt(page_size);

    // Calculate the offset for pagination
    const offset = (pageNo - 1) * pageSize;

    // Query the database with limit and offset for pagination
    const language_result = await Hobbies.findAll({
      limit: pageSize,
      offset: offset,
    });

    // Return paginated results
    res.json({
      message: 'Successfully retrieved the list of data',
      data: language_result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error occurred while getting the list of data',
      error: error.message,
    });
  }
};


const searchHobbies = async (req, res) => {
  logger.info('INFO -> SEARCHING HOBBIES API CALLED');
  try {
    const { search_text } = req.params;
    const result = await Hobbies.findAll({
      where: {
        name: {
          [Op.like]: `${search_text}%`,
        },
      },
      attributes: ['id', 'name']
    });

    res.status(200).json({
      message: 'Languages found successfully',
      data: result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error generated while searching hobbies',
      error,
    });
  }
};


const addView = async (req, res) => {
  logger.info('INFO -> ADD VIEW API CALLED')
  try {

    const {
      video_id,
      viewers_id
    } = req.body;
    console.log(req.body, "body")

    let result = await VideoView.create({
      video_id,
      viewers_id
    })

    result = JSON.parse(JSON.stringify(result))
    if (!result) throw errorHandler('error generated while executing.')


    res.status(200).json({
      message: 'succcess',
      payload: result
    })

  } catch (error) {
    logger.error(error)
    res.json({ message: 'error generated while adding view', error })
  }
}



const addProfileVisit = async (req, res) => {
  logger.info('INFO -> ADDING PROFILE VISIT API CALLED')
  try {

    const {
      visitor_user_id,
      visited_user_id,
      promotion_id
    } = req.body;

    let results = await ProfileVisit.create({
      promotion_id,
      visitor_user_id,
      visited_user_id
    })
    if (!results) throw errorHandler('error generated while executing.')

    results = JSON.parse(JSON.stringify(results))

    res.status(200).json({
      message: 'succcess',
      payload: results
    })


  } catch (error) {
    logger.error(error)
    res.json({ message: 'error generated while adding view', error })
  }
}




const updatePicture = async (req, res) => {
  logger.info('INFO -> UPDATE PICTURE API CALLED')
  try {
    const image = req.files['images'] ? req.files['images'][0].originalname : null
    const imagePath = req.files['images'] ? req.files['images'][0].path : null

    const { id } = req.body;


    let result = await Video.update(
      { thum: `images/${image}` },
      { where: { id } }
    )

    result = JSON.parse(JSON.stringify(result))




    const uploadPicture = {
      Bucket: 'dreamapplication',
      Key: `images/${image}`,
      Body: fs.createReadStream(imagePath)
    };

    s3.upload(uploadPicture, (err, data) => {
      if (err) {
        logger.error('Error uploading picture:', err);
      } else {
        logger.info('picture uploaded successfully:', data.Location);
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local video file deleted:', imagePath);
          }
        });
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'error generated while updating profile picture', error })
  }
}


const getOccupations = async (req, res) => {
  logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
  try {
    // Retrieve occupations from the database
    const occupations = await Occupations.findAll();

    // Check if any occupations were found
    if (!occupations || occupations.length === 0) {
      return res.status(404).json({ message: 'No occupations found' });
    }

    // Return the list of occupations
    res.status(200).json({ occupations });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request', error });
  }
}




const sendNotification = async (req, res) => {
  logger.info('INFO -> SENDING NOTIFICATION API CALLED')
  try {
    const {
      title, // html with one tag and style
      subtitle, // html with one tag and style
      body, // html with one tag and style
      color, // color value
      importance, // HIGH, DEFAULT, LOW, MIN, NONE,
      sound_enabled, // boolean,
      vibration_enabled, // boolean
      id // array
    } = req.body;

    const channelId = uuid.v4()
    let largeIcon = req?.files['large_icon'][0]?.originalname;
    let large_icon_path = req?.files['large_icon'][0]?.path
    let bigPicture = req?.files['big_picture'][0]?.originalname;
    let big_picture_path = req?.files['big_picture'][0]?.path

    if (largeIcon) {
      const uploadLargeIocn = {
        Bucket: 'dreamapplication',
        Key: `notification/${largeIcon}`,
        Body: fs.createReadStream(large_icon_path)
      };
      s3.upload(uploadLargeIocn, (err, data) => {
        if (err) {
          logger.error('Error uploading video:', err);
        } else {
          logger.info('Video uploaded successfully:', data.Location);
          fs.unlink(large_icon_path, (unlinkErr) => {
            if (unlinkErr) {
              logger.error('Error deleting local video file:', unlinkErr);
            } else {
              logger.info('Local video file deleted:', large_icon_path);
            }
          });
        }
      });
    }


    if (bigPicture) {
      const uploadBigPicture = {
        Bucket: 'dreamapplication',
        Key: `notification/${bigPicture}`,
        Body: fs.createReadStream(big_picture_path)
      };
      s3.upload(uploadBigPicture, (err, data) => {
        if (err) {
          logger.error('Error uploading video:', err);
        } else {
          logger.info('Video uploaded successfully:', data.Location);
          fs.unlink(big_picture_path, (unlinkErr) => {
            if (unlinkErr) {
              logger.error('Error deleting local video file:', unlinkErr);
            } else {
              logger.info('Local video file deleted:', big_picture_path);
            }
          });
        }
      });
    }


    const large_icon = `https://dpcst9y3un003.cloudfront.net/notification/${largeIcon}`,
      big_picture = `https://dpcst9y3un003.cloudfront.net/notification/${bigPicture}`



    let result = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      attributes: ['device_token'],
    });
    const deviceTokens = result.map(user => user.device_token);



    await admin.messaging().sendEachForMulticast({
      tokens: deviceTokens,
      data: {
        notifee: JSON.stringify({
          title: title,
          subtitle: subtitle,
          body: body,
          android: {
            channelId: channelId,
            largeIcon: large_icon,
            importance: `AndroidImportance.${importance}`,
            color: color ? color : '#020202',
            sound: sound_enabled ? 'sound' : null,
            vibrationPattern: [300, 500],
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: big_picture
            },
          }
        }),
        channelId: {
          id: channelId,
          name: channelId,
          badge: true,
          importance: `AndroidImportance.${importance}`,
          sound: sound_enabled ? 'sound' : null,
          vibration: vibration_enabled,
          vibrationPattern: [300, 500],
        }
      }

    })

    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'Notification sended successfully'
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}

const getUserShortInfo = async (req, res) => {
  logger.info('INFO -> GETTING USER SHORT INFO API CALLED')
  try {
    const { ids } = req.body;

    let result = await User.findAll({
      attributes: ['id', 'nickname', 'profile_pic', 'username'],
      where: { id: ids },
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }

}

const getMultipleUsersDiamond = async (req, res) => {
  logger.info('INFO -> GETTING MULTIPLE USERS DIAMOND API CALLED')
  try {
    const { ids } = req.body;


    let result = await User.findAll({
      attributes: ['id', 'wallet', 'nickname', 'profile_pic', 'username'],
      where: { id: ids },
      order: [['wallet', 'DESC']]
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


const isUsersFollowings = async (req, res) => {
  logger.info('INFO -> CHECKING USERS FOLLOWINGS API CALLED')
  try {
    const { id } = req.userData;
    const { user_id } = req.params;

    console.log(id, user_id, "ids")

    let result = await UserRelationship.findOne({
      where: { sender_id: id, receiver_id: user_id }
    })
    result = JSON.parse(JSON.stringify(result))

    if (result) {
      res.status(200).json({
        success: true,
        data: result,
        message: 'success'
      })
    } else {
      res.status(200).json({
        success: false,
        data: result,
        message: 'success'
      })
    }

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


const getAllUserDiamondsByRanked = async (req, res) => {
  logger.info('INFO -> GETTING ALL USERS DIAMOND BY RANKED API CALLED')
  try {
    const { page_no, page_size } = req.params;

    const pageNo = parseInt(page_no);
    const pageSize = parseInt(page_size);

    // Calculate the offset for pagination
    const offset = (pageNo - 1) * pageSize;

    // Query the database with limit and offset for pagination
    const language_result = await User.findAll({
      limit: pageSize,
      offset: offset,
      attributes: ['id', 'wallet', 'nickname', 'profile_pic', 'username'],
      order: [['wallet', 'DESC']]
    });

    // Return paginated results
    res.json({
      message: 'Successfully retrieved the list of data',
      data: language_result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error occurred while getting the list of data',
      error: error.message,
    });
  }
}


const addBlockedUser = async (req, res) => {
  logger.info('INFO -> ADDING BLOCKED USER API CALLED')
  try {
    const { id } = req.userData;
    const { blocked_user_id } = req.body;

    let result = await UserToUserBlock.create({
      user_id: id,
      blocked_user_id
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


const removeBlockedUser = async (req, res) => {
  logger.info('INFO -> REMOVING BLOCKED USER API CALLED')
  try {
    const { id } = req.userData;
    const { blocked_user_id } = req.body;

    let result = await UserToUserBlock.destroy({
      where: { user_id: id, blocked_user_id }
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


const addFavouriteUser = async (req, res) => {
  logger.info('INFO -> ADDING FAVOURITE USER API CALLED')
  try {
    const { id } = req.userData;
    const { favourite_user_id } = req.body;

    let result = await UserToUserFavourite.create({
      user_id: id,
      favourite_user_id
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}

const removeFavouriteUser = async (req, res) => {
  logger.info('INFO -> REMOVING FAVOURITE USER API CALLED')
  try {
    const { id } = req.userData;
    const { favourite_user_id } = req.body;

    let result = await UserToUserFavourite.destroy({
      where: { user_id: id, favourite_user_id }
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


const addUserReport = async (req, res) => {
  logger.info('INFO -> ADDING USER REPORT API CALLED')
  try {
    const { id } = req.userData;
    const { report_user_id, report_reason } = req.body;

    let result = await UserReport.create({
      user_id: id,
      report_user_id,
      report_reason
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      success: true,
      data: result,
      message: 'success'
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'Error generated while processing your request' })
  }
}


module.exports = {
  signup,
  login,
  updateUser,
  userInfo,
  userInfoById,
  uploadData,
  getAvatar,
  userExist,
  storePayments,
  sendGifts,
  follow,
  unfollow,
  getFollowersDetails,
  getFollowingsDetails,
  getAllMessages,
  getMyAllChatedPerson,
  getAllFollowingsUsers,
  addUserInteractionTime,
  changeProfilePicture,
  changeProfileVideo,
  checkUsernameAvaliable,
  getLanguageAllLanguageList,
  searchLanguage,
  getAllHobbiesList,
  searchHobbies,
  addView,
  addProfileVisit,
  updatePicture,
  sendNotification,
  getOccupations,
  getUserShortInfo,
  getMultipleUsersDiamond,
  isUsersFollowings,
  getAllUserDiamondsByRanked,
  addBlockedUser,
  removeBlockedUser,
  addFavouriteUser,
  removeFavouriteUser
};
