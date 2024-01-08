const { sq } = require('../config/db')

const { DataTypes } = require('sequelize')



const liveStreamGiftStore = sq.define("live_stream_gift_store",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        gift_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gift_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {

            type: DataTypes.STRING,
            allowNull: false

        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }

);

module.exports = liveStreamGiftStore;
