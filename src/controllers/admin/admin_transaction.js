
const logger = require('../../utils/logger')
const { Transaction} = require('../../models')


const getTransaction = async (req, res) => {
    logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
    try {
        // Retrieve occupations from the database
        const transaction = await Transaction.findAll();

        // Check if any occupations were found
        if (!transaction || transaction.length === 0) {
            return res.status(404).json({ message: 'No transaction found' });
        }

        // Return the list of occupations
        res.status(200).json({ transaction });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};
module.exports = {
    getTransaction
}
