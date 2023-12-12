const { DataTypes } = require('sequelize');
const { sq } = require('../config/db');
const User = require('./user');

const WheelLuck = sq.define('wheel_luck', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    no_of_tickets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    diamonds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ticket_no: {
        type: DataTypes.JSON,
        allowNull: false
    },
});
module.exports = WheelLuck;