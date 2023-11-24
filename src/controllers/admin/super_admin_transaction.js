// In your Express backend
const logger = require('../../utils/logger')
const { Admin, SuperadminTransaction, UserAdminTransaction,Transaction,User,SuperAdminUserTransaction} = require('../../models');
const { Op } = require('sequelize');


const addMoneyToSuperAdmin = async (req, res) => {
  logger.info('INFO ->  ADD_MONEY_TO_SUPERADMIN API CALLED');

  try {
    const { amount } = req.body;

    // Find the superadmin by their role
    const superadmin = await Admin.findOne({ where: { role: 'superadmin' } });

    if (!superadmin) {
      return res.status(404).json({ message: 'Superadmin not found' });
    }

    // Add the specified amount to the superadmin's wallet
    superadmin.wallet += parseFloat(amount);
    await superadmin.save();

    // Create a transaction record
    const transaction = await SuperadminTransaction.create({
      diamond_value: parseInt(amount), // Adjust the field name based on your model
      receiver_id: superadmin.id,
      diamond_debited: false,
    });

    return res.status(200).json({ message: 'Money added successfully', transaction });
  } catch (error) {
    console.error('Error adding money to superadmin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const sendMoneyToAdmin = async (req, res) => {
  const { id, amount } = req.body;
  console.log(req.body, "datafrom backend")

  try {
    // Find the super admin by their role
    const superadmin = await Admin.findOne({ where: { role: 'superadmin' } });

    if (!superadmin) {
      return res.status(404).json({ message: 'Superadmin not found' });
    }

    // Deduct the specified amount from the super admin's wallet
    superadmin.wallet -= parseFloat(amount);
    await superadmin.save();

    // Find the user by their ID
    const user = await Admin.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the user's role and add the specified amount to their wallet
    if (user.role === 'admin' || user.role === 'assistant manager' || user.role === 'manager') {
      user.wallet += parseFloat(amount);
      await user.save();

      // Create a transaction record for the user
      const userTransaction = await UserAdminTransaction.create({
        diamond_value: parseFloat(amount),
        sender_id: superadmin.id,
        receiver_id: user.id,
        transaction_type: 'credit',

        // 'credit' for adding money to the user's wallet
      });

      // Create a transaction record for the super admin
      const superadminTransaction = await SuperadminTransaction.create({
        diamond_value: parseFloat(amount),
        receiver_id: user.id,
        diamond_debited: true,
      });

      return res.status(200).json({
        message: 'Money sent successfully',
        userTransaction,
        superadminTransaction,
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error sending money:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getWalletDetails = async (req, res) => {
  logger.info('INFO -> GET EMPLOYEES API CALLED');
  try {
    // Assuming "Admin" model has a "role" field that represents the employee's role
    const employees = await Admin.findAll({
      where: {
        role: {
          [Op.or]: ['superadmin']
        }
      }
    });

    res.status(200).json({ employees });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Error generated while processing your request' });
  }
};

const getSuper_admin_transaction = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10; // Set your desired page size

    const superadmins = await SuperadminTransaction.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.status(200).json({
      superadmins: superadmins.rows,
      totalCount: superadmins.count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(superadmins.count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating the response' });
  }
}


const getadmin_transaction = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10; // Set your desired page size

    const admins = await UserAdminTransaction.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.status(200).json({
      admins: admins.rows,
      totalCount: admins.count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(admins.count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating the response' });
  }
}

const sendMoneyToUser = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    console.log(amount, userId, "backend");

    const user = await User.findByPk(userId);
    console.log(user,"uuuuuuseeer")

    user.wallet += parseFloat(amount);
    await user.save();

    await SuperAdminUserTransaction.create({
      diamond_value: parseFloat(amount),
      receiver_id: user.id,
      diamond_debited: true,
    });

    // Assuming your association alias is 'superadminTransactions'
    await user.superadminTransactions.create({
      dimanond_value: parseFloat(amount),
      type: 'credit',
    });

    res.status(200).json({ message: 'Money added to user wallet successfully' });
  } catch (error) {
    console.error('Error adding money to user wallet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const removeMoneyFromUser = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Validate input
    if (!userId || !amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Check if the user has sufficient funds
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wallet < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Remove money from user's wallet
    user.wallet -= parseFloat(amount);
    await user.save();

    // Record transaction in superadmin user transaction table
    await SuperAdminUserTransaction.create({
      diamond_value: parseFloat(amount),
      receiver_id: user.id,
      diamond_debited: false,
    });

    res.status(200).json({ message: 'Money removed from user wallet successfully' });
  } catch (error) {
    console.error('Error removing money from user wallet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};











module.exports = {
  addMoneyToSuperAdmin, sendMoneyToAdmin, getWalletDetails, getSuper_admin_transaction, getadmin_transaction,sendMoneyToUser,removeMoneyFromUser
};
