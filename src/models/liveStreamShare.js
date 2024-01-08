const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')



const LiveStreamShare = sq.define("live_stream_share",
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
        shared_people_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
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

module.exports = LiveStreamShare;
