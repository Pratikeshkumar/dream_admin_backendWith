const { 
  
  UserRelationship, 
  Video, 
  PostComment, 
  UserInteraction, 
  Like,

  Transaction,
  Gift, 
  MessageSubscription,
  CommentRose,
  UserFriendTransaction,
  UserAdminTransaction,
  SuperadminTransaction,
 } = require('../../models');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');
const sequelize = require('sequelize')
const { fn, col, literal } = sequelize;



const getCoinAnalytics = async (req, res) => {
  logger.info("INFO -> Coin ANALYTICS API CALLED");

  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;
    let result = await Gift.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
          "day",
        ],
        [sequelize.fn("SUM", sequelize.col("diamonds")), "totalCoins"],
      ],
      where: {
        reciever_id: id,
        createdAt: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
      group: [
        [sequelize.fn('date_format', sequelize.col('createdAt'), '%d-%b')]
      ],
    });
    result = JSON.parse(JSON.stringify(result));
    console.log(result)
    let totalReceivedCoins = 0;
    result.forEach((item) => {
      totalReceivedCoins += Number(item.totalCoins);
    });
    res.status(201).json({
      message: "success",
      payload: result,
      totalReceivedCoins,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "error while fetching Coins analytics,please try" });
  }
};

const ViewersSubmitComment = async (req, res) => {
  logger.info("INFO -> Comment ANALYTICS API CALLED");
  try {
    let { startingtime, endingtime } = req.params;
    console.log(startingtime, endingtime);
    let { id } = req.userData;
    const videos = await Video.findAll({
      attributes: ["id"],
      where: {
        user_id: id,
        created: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
    });

    const videoIds = videos.map((video) => video.id);

    let result = await PostComment.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
          "day",
        ],

        [sequelize.fn("COUNT", sequelize.col("id")), "total_received_comments"],
      ],
      where: {
        video_id: videoIds,
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
      ],
      raw: true,
    });
    let totalReceivedComments = 0;
    result.forEach((item) => {
      totalReceivedComments += Number(item.total_received_comments);
    });
    result = JSON.parse(JSON.stringify(result));
    res.status(201).json({
      message: "success",
      payload: {
        result,
        totalReceivedComments,
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "error while fetching comment analytics,please try" });
  }
};

const getLikeAnalytics = async (req, res) => {
  logger.info("INFO -> Like ANALYTICS API CALLED");
  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;
    let result = await Like.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
          "day",
        ],

        [sequelize.fn("COUNT", sequelize.col("id")), "total_like"],
      ],

      where: {
        reciever_id: id,
        createdAt: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
      ],
    });

    result = JSON.parse(JSON.stringify(result));

    let total_like_received = 0;
    result.forEach((item) => {
      total_like_received += item.total_like;
    });

    res.status(201).json({
      message: "success",
      payload: result,
      total_like_received,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "error while fetching Like analytics,please try" });
  }
};

// down is the code for follow Analytics;

const getFollowAnalytics = async (req, res) => {
  logger.info("INFO -> Follow ANALYTICS API CALLED");
  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;
    let result = await UserRelationship.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
          "day",
        ],

        [sequelize.fn("COUNT", sequelize.col("id")), "total_follow"],
      ],

      where: {
        receiver_id: id,
        createdAt: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
      ],
    });

    result = JSON.parse(JSON.stringify(result));

    let total_follow_initiated = 0;
    result.forEach((item) => {
      total_follow_initiated += item.total_follow;
    });
    res.status(201).json({
      message: "success",
      payload: result,
      total_follow_initiated,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "error while fetching Follow analytics, please try again" });
  }
};



const getUserInteractions = async (req, res) => {
  logger.info("INFO -> User Interaction API CALLED");

  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;

    let result = await UserInteraction.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("interaction_start"), "%Y-%m-%d"),
          "day",
        ],

        [sequelize.fn("SUM", sequelize.col("interacted_time")), "total_interacted_time"],
      ],

      where: {
        user_id: id, // Assuming user_id corresponds to the logged-in user
        interaction_start: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("interaction_start"), "%Y-%m-%d"),
      ],
    });

    result = JSON.parse(JSON.stringify(result))

    // console.log(result)


    let total_time_spended = 0;
    result.forEach((item) => {
      total_time_spended += Number(item.total_interacted_time)
    });
    res.status(200).json({
      message: "Success",
      payload: result,
      total_time_spended: Math.round(total_time_spended / (1000 * 60))
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error while fetching User Interactions, please try again" });
  }
};






const getTimeTimeToHighestDiamondViewers = async (req, res) => {
  logger.info("INFO -> TimeTimeToHighestDiamondViewers API CALLED");

  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;

    let result = await UserInteraction.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("interaction_start"), "%Y-%m-%d"),
          "day",
        ],

        [sequelize.fn("SUM", sequelize.col("interacted_time")), "total_interacted_time"],
      ],

      where: {
        user_id: id, // Assuming user_id corresponds to the logged-in user
        interaction_start: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("interaction_start"), "%Y-%m-%d"),
      ],
    });

    result = JSON.parse(JSON.stringify(result))

    // console.log(result)
    

    let total_time_spended = 0;
    result.forEach((item) => {
      total_time_spended += Number(item.total_interacted_time)
    });
    res.status(200).json({
      message: "Success",
      payload: result,
      total_time_spended: Math.round(total_time_spended / (1000 * 60))
    });

  }

  catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Error while fetching User Interactions, please try again" });
  }

}






























module.exports = {
  getCoinAnalytics,
  ViewersSubmitComment,
  getLikeAnalytics,
  getFollowAnalytics,
  getUserInteractions

};