const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video')
const PostComment = require('./comment')

const CommentRose = sq.define(
    "comment_rose", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    diamonds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    video_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Video, 
            key: 'id',
          },
    },
    reciever_id: {
        type: DataTypes.INTEGER,
        unique: false,
        references: {
            model: User,
            key: 'id'
          }
    },
    sender_id: {
        type: DataTypes.INTEGER,
        unique: false,
        references: {
            model: User,
            key: 'id'
          }
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PostComment,
            key: 'id'
        }
    }
});



module.exports = CommentRose;
