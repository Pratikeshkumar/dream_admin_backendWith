// models/StripeAccount.js

const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');
const User = require('./user');

const StripeAccount = sq.define(
  'stripe_account',
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
    stripeAccountId: {
      type: DataTypes.STRING,
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    tokenExpiry: {
      type: DataTypes.DATE,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);



module.exports = StripeAccount;
