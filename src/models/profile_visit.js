const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user')

const ProfileVisit = sq.define(
    "profile_visits",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        promotion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        visitor_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        visited_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = ProfileVisit;


