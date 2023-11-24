const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');

const VideoReport = sq.define('video_report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});



module.exports = VideoReport;