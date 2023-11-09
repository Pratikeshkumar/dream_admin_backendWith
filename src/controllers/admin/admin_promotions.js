// all promotions
// live promotions
// accomplished promotions
// reported promotions
// Failure promotions



const logger = require('../../utils/logger')
const { Promotion, User, Video } = require('../../models')


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

    getPromotions
}