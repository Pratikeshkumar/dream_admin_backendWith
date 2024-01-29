const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user");

const UserPrivacy = sq.define(
    "user_privacy",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        who_can_message_me: {
            type: DataTypes.ENUM('everyone', 'following each other', 'nobody'),
            defaultValue: 'everyone',
        },
        who_can_view_my_profile: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_view_my_like_list: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_view_my_comment_list: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_view_my_post: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_see_my_followers: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_see_my_following: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        who_can_see_my_birthday: {
            type: DataTypes.ENUM('everyone', 'following each other', 'only me'),
            defaultValue: 'everyone',
        },
        hide_location_in_profile: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dont_recommened_me_to_my_friends: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dont_recommend_my_live_to_friends_in_the_live: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        enable_other_to_duet_with_my_videos: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        enable_other_to_save_my_post: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        enable_other_to_comment_on_my_post: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        allow_screenshot_or_screen_recording_of_my_content: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = UserPrivacy;