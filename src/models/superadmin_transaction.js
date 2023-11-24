// models/superadminTransaction.js

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sq } = require("../config/db");

const SuperadminTransaction = sq.define('SuperadminTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  diamond_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(), 
  },
  diamond_debited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  video_id: {
    type: DataTypes.STRING, 
  },
  timestamp: {
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
  },
 
});

module.exports = SuperadminTransaction;
