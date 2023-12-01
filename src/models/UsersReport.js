const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require("./user");

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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT(1000),
      allowNull: false,
    },
    video: {
        type: DataTypes.TEXT(1000),
        allowNull: false,
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