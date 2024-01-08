// models/WithdrawalRequest.js

const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');
const User = require('./user');
const PayPalAccount = require('./paypal_account');
const StripeAccount = require('./stripe_account')

const WithdrawalRequest = sq.define(
  'withdrawal_request',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    paypal_account_id: {
      type: DataTypes.INTEGER,
      references: {
        model: PayPalAccount,
        key: 'id',
      },
    },
    stripe_account_id: {
        type: DataTypes.INTEGER,
        references: {
          model: StripeAccount,
          key: 'id',
        },
      },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending',
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);


module.exports = WithdrawalRequest;
