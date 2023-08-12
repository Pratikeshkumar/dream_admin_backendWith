const { User, Avatar, Transaction, Gift, Video, UserRelationship, Like, Message } = require("../../models");
const fs = require('fs');
const errorHandler = require("../../utils/errorObject");
const { JWT_KEY } = process.env;
const logger = require('../../utils/logger');
const jwt = require("jsonwebtoken");
const cloudinary = require('../../config/cloudinary');
const { Op, literal } = require('sequelize');
const sequelize = require('sequelize')


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
          attributes: ['id', 'description', 'video', 'thum', 'view', 'diamond_value'],
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
          attributes: ['id', 'description', 'video', 'thum', 'view', 'diamond_value'],
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
  getAllFollowingsUsers
};
