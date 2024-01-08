// models/SuperAdminUser.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sq } = require("../config/db");

const SuperAdminUserTransaction = sq.define('SuperAdminUserTransaction', {
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
}, {
  timestamps: true, // This will add the createdAt and updatedAt timestamps
  updatedAt: false, // If you don't want an updatedAt field
});

module.exports = SuperAdminUserTransaction;
