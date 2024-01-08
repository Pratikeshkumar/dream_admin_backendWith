const { DataTypes } = require('sequelize');
const { sq } = require("../config/db");

const Country = sq.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iso3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonecode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capital: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  native: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subregion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emoji: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emojiU: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  flag: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wikiDataId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'countries', // Assuming the table name is 'countries'
  timestamps: true, // Enable automatic createdAt and updatedAt fields
  createdAt: 'created_at', // Customize createdAt field name if necessary
  updatedAt: 'updated_at', // Customize updatedAt field name if necessary
});

module.exports = Country;
