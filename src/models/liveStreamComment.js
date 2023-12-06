const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')
const LiveStreamGiftStore = require('./liveStreamGiftStore')



const LiveStreamComment = sq.define("live_stream_comment",
    {
        live_share_id: {
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
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        comment_text: {
            type: DataTypes.STRING,
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

module.exports = LiveStreamComment;
