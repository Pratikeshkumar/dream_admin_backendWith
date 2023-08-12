const { Gift, Video ,Like} = require('../../models');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');
const sequelize = require('sequelize')
const { fn, col, literal } = sequelize;


const getDiamondAnalytics = async (req, res) => {
  logger.info('INFO -> DIAMOND ANALYTICS API CALLED');

  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData;
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let result = await Gift.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('diamonds')), 'totalDiamonds'],
        [literal('DAYNAME(createdAt)'), 'dayOfWeek'], // Extract the day of the week

      ],

      where: {
        reciever_id: id,
        createdAt: {
          [Op.between]: [startingtime, endingtime],
        },
      },
      group: [literal('DAYNAME(createdAt)')], // Group by the day of the week

    });

    result = JSON.parse(JSON.stringify(result))
    console.log(result)

    res.status(201).json({
      message: 'success',
      payload: result
    })

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'error while fetching diamond analytics,please try' });
  }
};

const getLikeAnalytics = async (req, res) => {
  logger.info('INFO -> Like ANALYTICS API CALLED');
  try {
    let { startingtime, endingtime } = req.params;
    let { id } = req.userData
    let result = await Like.findAll({
      attributes: [
        // [sequelize.fn('DAYOFWEEK', sequelize.col('createdAt')), 'day'],
        [sequelize.fn('SUM', sequelize.col('id')), 'total_like'],
        [literal('DAYNAME(createdAt)'), 'dayOfWeek'], // Extract the day of the week

    ],

      where: {
        reciever_id: id,
        createdAt: {
          [Op.between]: [new Date(startingtime), new Date(endingtime)],
        },

      },
      group: [literal('DAYNAME(createdAt)')], // Group by the day of the week

    })
    result = JSON.parse(JSON.stringify(result))
console.log(result)
    res.status(201).json({
      message: 'success',
      payload: result
    })
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'error while fetching Like analytics,please try' });

  }

}
module.exports = {
  getDiamondAnalytics,
  getLikeAnalytics,
};
