const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video');
const Tag = require("./tags");




const TaggingText = sq.define('tagging_text', {
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
    tagged_tags: {
        type: DataTypes.INTEGER,
        references: {
            model: Tag,
            key: 'id'
        }
    }
});


module.exports = TaggingText
