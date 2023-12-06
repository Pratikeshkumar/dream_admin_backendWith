const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')



const LiveStreamViewers = sq.define("live_stream_viewers",
    {
        viewers_id: {
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
        time_watched: {
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

module.exports = LiveStreamViewers;
