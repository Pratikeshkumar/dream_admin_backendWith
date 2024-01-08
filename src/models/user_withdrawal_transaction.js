// models/WithdrawalTransaction.js

const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');
const User = require('./user');
const { v4: uuidv4 } = require('uuid');

const WithdrawalTransaction = sq.define(
  'withdrawal_transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
   
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);



module.exports = WithdrawalTransaction;
