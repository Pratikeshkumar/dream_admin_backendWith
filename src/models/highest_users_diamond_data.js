const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('../models')

const HighestUsersDiamondsData = sq.define(
    "highest_users_diamond_data",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('last_1_hour', 'last_24_hours', 'last_7_days', 'last_30_days'),
            allowNull: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        transaction_type: {
            type: DataTypes.ENUM('sender', 'reciever'),
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        timestamps: true
    }
)

module.exports = HighestUsersDiamondsData;