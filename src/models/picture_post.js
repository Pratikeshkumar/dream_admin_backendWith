const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user')

const PicturePost = sq.define(
    "picture_post",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
        description: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        view: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        privacy_type: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'public'
        },
        like: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comment: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        shared: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        }

    },
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = PicturePost;


