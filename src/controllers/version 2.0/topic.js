const logger = require("../../utils/logger");
const { Topic } = require('../../models');

const listTopics = async (req, res) => {
    logger.info('INFO -> GETTING TOPIC API CALLED');

    try {
        const { page = 1, limit = 10 } = req.params;
        const offset = (page - 1) * limit;


        
        // Fetch topics with pagination
        const topics = await Topic.findAll({
            limit: parseInt(limit, 10),
            offset,
        });

        return res.status(200).json({
            success: true,
            data: topics,
        });
    } catch (error) {
        logger.error('Error fetching topics:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

const searchTopics = async (req, res) => {
    logger.info('INFO -> SEARCHING TOPIC API CALLED');

    try {
        const { search = '' } = req.params;

        // Search for topics based on the name field
        const topics = await Topic.findAll({
            where: {
                name: {
                    [Sequelize.Op.iLike]: `%${search}%`, // Case-insensitive search
                },
            },
        });

        return res.status(200).json({
            success: true,
            data: topics,
        });
    } catch (error) {
        logger.error('Error searching topics:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

module.exports = { listTopics, searchTopics };
