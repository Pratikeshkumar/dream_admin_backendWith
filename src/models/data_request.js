const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user"); // Import the User model

const DataRequest = sq.define(
  "data_request", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    url: {
      type: DataTypes.STRING, // You can adjust the data type based on your requirements
    },
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = DataRequest;
