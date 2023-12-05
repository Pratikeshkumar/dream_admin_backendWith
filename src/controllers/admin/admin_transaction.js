
const logger = require('../../utils/logger')
const { Transaction,User} = require('../../models')


const getTransaction = async (req, res) => {
    logger.info('INFO -> GETTING TRANSACTION API CALLED');
    try {
        // Retrieve transactions from the database along with user data
        const transactions = await Transaction.findAll({
            include: [{ model: User, attributes: ['id', 'username', 'email'] }] // Add the attributes you want to retrieve from the User model
        });

        // Check if any transactions were found
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        console.log(transactions.user)

        // Return the list of transactions with user data
        res.status(200).json({ transactions });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};

module.exports = {
    getTransaction
}
