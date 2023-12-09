const {sq} = require('../config/db')
const { DataTypes } = require('sequelize');
const { User } = require('./user')
const { Video } = require('./video')


const Transaction = sq.define('transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  payments_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payer_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  account_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  account_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount_value: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reference_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address_line_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_area_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_area_2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dimanond_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
    timestamps: true,
    freezeTableName: true,
  }
);


module.exports = Transaction;
