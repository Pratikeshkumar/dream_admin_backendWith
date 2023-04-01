const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Tag = sq.define(
  "tags",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "created",
    updatedAt: false,
  }
);

module.exports = Tag;
