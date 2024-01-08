const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')


const Video = sq.define(
  "videos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gif: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    view: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sound_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    privacy_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'public'
    },
    allow_comments: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    allow_duet: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    block: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    duet_video_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_video_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    promote: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    allow_stitch: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
    diamond_value: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created",
    updatedAt: false,
  }
);

module.exports = Video;
