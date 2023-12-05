const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const roles = ["superadmin", "manager", "assistant manager", "admin"];

const Admin = sq.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...roles),
      allowNull: false,
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      values: [1, 0],
      defaultValue: 1,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: function () {
        let d = new Date();
        return d.toISOString();
      },
    },
    wallet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, 
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Admin;
