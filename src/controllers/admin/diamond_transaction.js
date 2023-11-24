
const logger = require('../../utils/logger')
const { Transaction, Gift ,CommentRose,MessageSubscription,User} = require('../../models')


const getRoseTransaction = async (req, res) => {
    logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
    try {
        // Retrieve transactions from the database
        const transactions = await CommentRose.findAll();

        // Check if any transactions were found
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        // Create arrays to store user IDs
        const userIds = [];

        // Extract user IDs from transactions
        transactions.forEach(transaction => {
            userIds.push(transaction.reciever_id);
            userIds.push(transaction.sender_id);
        });

        logger.info('User IDs:', userIds);

        // Fetch user information based on user IDs
        const users = await User.findAll({
            where: {
                id: userIds
            }
        });

        logger.info('Users:', users);

        // Create a map for quick access to user information based on user ID
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Attach user information to each transaction
        const transactionsWithUsers = transactions.map(transaction => ({
            ...transaction.toJSON(),
            receiver: userMap.get(transaction.reciever_id),
            sender: userMap.get(transaction.sender_id)
        }));

        logger.info('Transactions with Users:', transactionsWithUsers);

        // Return the list of transactions with user information
        res.status(200).json({ transactions: transactionsWithUsers });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};



const getMessageSubscriptionTransaction = async (req, res) => {
    logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
    try {
        // Retrieve transactions from the database
        const transactions = await MessageSubscription.findAll();

        // Check if any transactions were found
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        // Create arrays to store user IDs
        const userIds = [];

        // Extract user IDs from transactions
        transactions.forEach(transaction => {
            userIds.push(transaction.reciever_id);
            userIds.push(transaction.sender_id);
        });

        logger.info('User IDs:', userIds);

        // Fetch user information based on user IDs
        const users = await User.findAll({
            where: {
                id: userIds
            }
        });

        logger.info('Users:', users);

        // Create a map for quick access to user information based on user ID
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Attach user information to each transaction
        const transactionsWithUsers = transactions.map(transaction => ({
            ...transaction.toJSON(),
            receiver: userMap.get(transaction.reciever_id),
            sender: userMap.get(transaction.sender_id)
        }));
     

        logger.info('Transactions with Users:', transactionsWithUsers);

        // Return the list of transactions with user information
        res.status(200).json({ transactions: transactionsWithUsers });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};



const getVideoGiftTransaction = async (req, res) => {
    logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
    try {
        // Retrieve transactions from the database
        const transactions = await Gift.findAll();

        // Check if any transactions were found
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        // Create arrays to store user IDs
        const userIds = [];

        // Extract user IDs from transactions
        transactions.forEach(transaction => {
            userIds.push(transaction.reciever_id);
            userIds.push(transaction.sender_id);
        });

        // Fetch user information based on user IDs
        const users = await User.findAll({
            where: {
                id: userIds
            }
        });

        // Create a map for quick access to user information based on user ID
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user.id, user);
        });

        // Attach user information to each transaction
        const transactionsWithUsers = transactions.map(transaction => ({
            ...transaction.toJSON(),
            receiver: userMap.get(transaction.reciever_id),
            sender: userMap.get(transaction.sender_id)
        }));

        // Return the list of transactions with user information
        res.status(200).json({ transactions: transactionsWithUsers });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};






module.exports = {
    getRoseTransaction,
    getMessageSubscriptionTransaction,
    getVideoGiftTransaction
}
