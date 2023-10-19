const { DataTypes } = require('sequelize');
const { sq } = require("../config/db");



const City = sq.define(
  'City',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    state_id: {
      type: DataTypes.INTEGER,
    },
    state_code: {
      type: DataTypes.STRING,
    },
    country_id: {
      type: DataTypes.INTEGER,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    flag: {
      type: DataTypes.INTEGER,
    },
    wikiDataId: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_on',
    modelName: 'City',
    tableName: 'cities',
  }
);

module.exports = City;
