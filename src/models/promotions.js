const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user');
const Video = require("./video");


const Promotion = sq.define(
    "promotions",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        video_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Video,
                key: 'id'
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        ending_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        way_to_promote: {
            type: DataTypes.STRING,
            allowNull: true
        },
        custom_audience: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        daily_total_budget_in_dollar: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        how_long_would_to_promote_in_days: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number_of_like: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number_of_followers: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number_of_profile_visit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        number_of_comments: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cities: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        countries: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        audience_age: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_coin: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_money_in_dollar: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = Promotion;


