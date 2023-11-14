const logger = require("../../utils/logger")
const {
    LiveSettings,
    User,
    liveStreamGiftStore
} = require('../../models')
const { kafka, producer, admin } = require('../../config/kafka')
const { redis } = require('../../config/redis')



const addLiveSettings = async (req, res) => {
    logger.info('INFO -> ADDING LIVE SETTINGS API CALLED')
    try {
        const { id } = req.userData;
        const {
            topic,
            description,
            live_gift_allowed,
            audience_control_only_eighteen_plus,
            comment_allowed,
            filter_comment_allowed,
            mute_voice,
            supervisors_role,
            secreterial_role,
            administration_role,
            supervisors_list,
            secreterial_list,
            administration_list,
            main_stream_url,
            live_active
        } = req.body;
        const data = {
            user_id: id,
            topic,
            description,
            live_gift_allowed,
            audience_control_only_eighteen_plus,
            comment_allowed,
            filter_comment_allowed,
            mute_voice,
            supervisors_role: [supervisors_role],
            secreterial_role: [secreterial_role],
            administration_role: [administration_role],
            supervisors_list,
            secreterial_list,
            administration_list,
            main_stream_url,
            live_active: true
        }
        let result = await LiveSettings.create({
            user_id: id,
            topic,
            description,
            live_gift_allowed,
            audience_control_only_eighteen_plus,
            comment_allowed,
            filter_comment_allowed,
            mute_voice,
            supervisors_role: [supervisors_role],
            secreterial_role: [secreterial_role],
            administration_role: [administration_role],
            supervisors_list,
            secreterial_list,
            administration_list,
            main_stream_url,
            live_active: true
        })
        if (!result) { res.status(res.status(500).json({ message: 'Error generated while processing your request' })) }
        result = JSON.parse(JSON.stringify(result))

        res.status(200).json({
            success: true,
            result: result
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated whole processing you request', error })
    }
}














const updateActiveLive = async (req, res) => {
    logger.info('INFO -> LIVE STATUS UPDATING API CALLED')
    try {
        const { id } = req.userData;
        const { live_active } = req.body;

        let result = await LiveSettings.update(
            { live_active: live_active },
            { where: { user_id: id } }
        )
        res.status(200).json({
            success: true,
            message: 'successfully updated'
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request', error })
    }

}


const getAllActiveLiveStream = async (req, res) => {
    logger.info('INFO -> GETTING ACTIVE LIVE STREAM API CALLED');
    try {
        const { pageNo, pageSize } = req.params;
        let page_no = Number(pageNo);
        let page_size = Number(pageSize);

        // Calculate the offset based on page number and page size
        const offset = (page_no - 1) * page_size;

        let result = await LiveSettings.findAndCountAll({
            where: { live_active: true },
            limit: page_size,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'nickname', 'profile_pic'],
                }
            ],
            offset: offset,
        });

        if (result.count === 0) {
            res.status(204).json({
                success: false,
                message: 'No active live streams found'
            });
        } else {
            res.status(200).json({
                success: true,
                result: result.rows,
                totalCount: result.count,
            });
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
}



const getAllLiveStreamGift = async (req, res) => {
    logger.info('INFO -> GETTING ALL LIVE STREAM API CALLED')
    try {
        const { categories } = req.params;


        let result = await liveStreamGiftStore.findAll({
            where: { category: categories }
        })
        result = JSON.parse(JSON.stringify(result))

        res.status(200).json({
            success: true,
            gift: result
        })

    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request' })
    }
}









module.exports = {
    addLiveSettings,
    updateActiveLive,
    getAllActiveLiveStream,
    getAllLiveStreamGift
}