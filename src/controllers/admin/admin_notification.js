const logger = require('../../utils/logger')
const { admin } = require('../../../firebaseAdmin')
const {} = require('../../models')

const sendNotification = async (req, res) => {
    logger.info('INFO -> SENDING NOTIFICATION API CALLED')
    try {
        const {
            id
        } = req?.body;


    


    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request' })
    }

}