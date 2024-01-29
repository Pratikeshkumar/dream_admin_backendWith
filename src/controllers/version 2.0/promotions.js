const logger = require('../../utils/logger')
const { Promotion, User, Video } = require('../../models')


const startPromotions = async (req, res) => {
    logger.info('INFO -> STARTING PROMOTIONS API CALLED')
    try {
        const {
            video_id,
            is_active,
            start_date,
            ending_date,
            way_to_promote,
            custom_audience,
            daily_total_budget_in_dollar,
            how_long_would_to_promote_in_days,
            number_of_like,
            number_of_followers,
            number_of_profile_visit,
            number_of_comments,
            gender,
            cities,
            countries,
            audience_age,
            total_coin,
            total_money_in_dollar
        } = req.body;

        const { id } = req.userData;

        let result = await Promotion.create({
            user_id: id,
            video_id,
            is_active: true,
            start_date: new Date(),
            ending_date,
            way_to_promote,
            custom_audience,
            daily_total_budget_in_dollar,
            how_long_would_to_promote_in_days,
            number_of_like,
            number_of_followers,
            number_of_profile_visit,
            number_of_comments,
            gender,
            cities,
            countries,
            audience_age,
            total_coin,
            total_money_in_dollar

        })

        result = JSON.parse(JSON.stringify(result))

        res.status(200).json({
            success: true,
            message: 'successfully started',
            result: result
        })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request' })
    }
}



const getPromotions = async (req, res) => {
    logger.info('INFO -> GETTING PROMOTIONS API CALLED')
    try {


        let result = await Promotion.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname', 'username', 'profile_pic', 'wallet'],
                    as: 'user'
                },
                {
                    model: Video,
                    as: 'video'
                }
            ]
        })

        result = JSON.parse(JSON.stringify(result))

        res.status(200).json({
            success: true,
            message: 'successfully fetched all promotions',
            result: result
        })


    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request' })
    }
}



module.exports = {
    startPromotions,
    getPromotions
}