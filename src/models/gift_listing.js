const { sq } = require('../config/db')

const { DataTypes } = require('sequelize')



const GiftListing = sq.define(
    "gift_listing",
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
        category:{

            type: DataTypes.STRING,
            allowNull: false

        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }

);

module.exports = GiftListing;
