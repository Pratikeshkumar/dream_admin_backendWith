const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user');
const Video = require("./video");

const VideoView = sq.define(
    "video_view",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        video_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Video,
                key: 'id'
            }
        },
        viewers_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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

module.exports = VideoView;
