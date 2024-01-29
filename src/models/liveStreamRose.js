const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')



const LiveStreamRose = sq.define("live_stream_rose",
    {
        live_rose_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        live_stream_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        claimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        total_diamond: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        no_of_rose: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }

);

module.exports = LiveStreamRose;
