const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user");

const UsersReports = sq.define(
  "user_reports",
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
    report_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },

    
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = UsersReports;