// models/PayPalAccount.js

const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');

const User = require('./user')


const PayPalAccount = sq.define('paypal_account', {

    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    paypalAccountId: {
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
    paypalEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    billingAddress: {
        type: DataTypes.STRING,
    },
},
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = PayPalAccount;
