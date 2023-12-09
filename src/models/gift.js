const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video')

const Gift = sq.define(
    "gifts", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    diamonds: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  },
);



module.exports = Gift;
