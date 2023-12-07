// To Do 
// 1. Changing the user privacy list : Done
// 2. Adding the user privacy list   : Done
// 3. Getting the user privacy list  : Done


const logger = require('../../utils/logger');
const { UserPrivacy } = require('../../models');
const { redis } = require('../../config/redis');





const addUserPrivacy = async (req, res) => {
    logger.info('INFO -> ADDING USER PRIVACY API CALLED');
    try {
        const { id } = req.userData;
        const {
            user_privacy_list
        } = req.body;
        const data = {
            user_id: id,
            user_privacy_list
        }
        let result = await UserPrivacy.create(data);
        if (result) {
            return res.status(200).json({
                success: true,
                message: 'User Privacy Added Successfully'
            })
        }
    } catch (error) {
        logger.error('ERROR -> ADDING USER PRIVACY API CALLED', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}




const updateUserPrivacy = async (req, res) => {
    logger.info('INFO -> UPDATING USER PRIVACY API CALLED');
    try {
        const { id } = req.userData;
        const {
            user_privacy_list
        } = req.body;
        const data = {
            user_id: id,
            user_privacy_list
        }
        let result = await UserPrivacy.update(data, {
            where: {
                user_id: id
            }
        });
        if (result) {
            return res.status(200).json({
                success: true,
                message: 'User Privacy Updated Successfully'
            })
        }
    } catch (error) {
        logger.error('ERROR -> UPDATING USER PRIVACY API CALLED', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}




const getUserPrivacy = async (req, res) => {
    logger.info('INFO -> GETTING USER PRIVACY API CALLED');
    try {
        const { id } = req.userData;
        const result = await UserPrivacy.findOne({
            where: {
                user_id: id
            }
        });
        if (result) {
            return res.status(200).json({
                success: true,
                result: result
            })
        }
    } catch (error) {
        logger.error('ERROR -> UPDATING USER PRIVACY API CALLED', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}



module.exports = {
    addUserPrivacy,
    updateUserPrivacy,
    getUserPrivacy
}