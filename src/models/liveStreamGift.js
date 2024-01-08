const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')
const LiveStreamGiftStore = require('./liveStreamGiftStore')



const LiveStreamGift = sq.define("live_stream_gift",
    {
        live_gift_id: {
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
        no_of_gifts: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gift_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: LiveStreamGiftStore,
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

module.exports = LiveStreamGift;
