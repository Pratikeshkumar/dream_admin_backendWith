const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require('./user');

const Occupations = sq.define(
    "occupations",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'occupations', // This references the same table
                key: 'id',
            },
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

// Define associations for self-referencing
Occupations.hasMany(Occupations, { foreignKey: 'parentId', as: 'children' });
Occupations.belongsTo(Occupations, { foreignKey: 'parentId', as: 'parent' });

// Define associations with other models if necessary
Occupations.belongsTo(User, { foreignKey: "userId" });

module.exports = Occupations;
