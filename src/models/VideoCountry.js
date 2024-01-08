const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video');
const Tag = require("./tags");
const Country = require("./countries");




const VideoCountry = sq.define('video_country', {
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
    countriesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Country,
            key: 'id'
        }
    }
});


module.exports = VideoCountry
