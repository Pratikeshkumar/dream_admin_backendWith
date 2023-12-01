const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user");

const UserToUserFavourite = sq.define(
  "user_to_user_favourite",
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
    favourite_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = UserToUserFavourite;