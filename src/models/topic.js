const { sq } = require('../config/db')
const { DataTypes } = require('sequelize');
const { User } = require('./user')
const { Video } = require('./video')


const Topic = sq.define('topic', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    topic_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        freezeTableName: true,
        timestamps: false
    });


module.exports = Topic;
