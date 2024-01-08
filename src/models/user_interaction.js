const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user");

const UserInteraction = sq.define(
    "user_interaction",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        interaction_start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        interacted_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: "created",
        updatedAt: false,
    }
);

module.exports = UserInteraction;
