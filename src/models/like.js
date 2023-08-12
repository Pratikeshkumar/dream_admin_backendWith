const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video')

const Like = sq.define(
    "likes", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    video_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Video,
            key: 'id',
        },
    },
    reciever_id: {
        type: DataTypes.INTEGER,
        unique: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    sender_id: {
        type: DataTypes.INTEGER,
        unique: false, 
        references: {
            model: User,
            key: 'id'
        }
    },
}, {
    uniqueKeys: {
        unique_like: {
            fields: ['video_id', 'reciever_id', 'sender_id']
        }
    }
});



module.exports = Like;
