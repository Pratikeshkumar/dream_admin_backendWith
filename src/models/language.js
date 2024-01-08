const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video');
const PostComment = require("./comment");


const Language = sq.define(
    "languages", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},
    {
        timestamps: true,
        freezeTableName: true
    });



module.exports = Language;
