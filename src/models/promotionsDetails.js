const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user');
const Video = require("./video");





const PromotionsDetails = sq.define(
    "promotions_details",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        promotions_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        promotion_way: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        audience_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        

    },
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = PromotionsDetails;


