const { sq } = require("../config/db");
const { DataTypes, } = require("sequelize");
const Video = require("./video");
const User = require("./user");

const PostComment = sq.define(
  "comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
    },
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Video,
        key: 'id'
      }
    },
    comment_data: {
      type: DataTypes.STRING,
      allowNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dislike: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rose: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },

  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = PostComment;
