const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user')

const LiveSettings = sq.define("live_settings", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    live_gift_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    audience_control_only_eighteen_plus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    comment_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    filter_comment_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    mute_voice: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supervisors_role: {
        type: DataTypes.JSON,
        allowNull: false
    },
    secreterial_role: {
        type: DataTypes.JSON,
        allowNull: false
    },
    administration_role: {
        type: DataTypes.JSON,
        allowNull: false
    },
    supervisors_list: {
        type: DataTypes.JSON,
        allowNull: true
    },
    secreterial_list: {
        type: DataTypes.JSON,
        allowNull: true
    },
    administration_list: {
        type: DataTypes.JSON,
        allowNull: true
    },
    main_stream_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    live_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    guest_stream_url: {
        type: DataTypes.JSON,
        allowNull: true
    }
});



module.exports = LiveSettings;

