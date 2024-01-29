const { sq } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')
const video=require('./video')


const Videoshare = sq.define("Videoshare",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        video_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: video,
                key: 'id'
            }
        },
        shared_people_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        // timestamp: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: DataTypes.NOW,
        // },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        }

    },
    {
        freezeTableName: true,
        timestamps: true,
        
    }

);

module.exports = Videoshare;
