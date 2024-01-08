const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");


const Hobbies = sq.define(
    "hobbies",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
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
)

module.exports = Hobbies;