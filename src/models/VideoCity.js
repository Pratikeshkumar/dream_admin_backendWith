const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video');
const Tag = require("./tags");
const City = require("./cities");




const VideoCity = sq.define('video_city', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Video,
            key: 'id'
        }
    },
    city_id: {
        type: DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id'
        }
    }
});


module.exports = VideoCity
