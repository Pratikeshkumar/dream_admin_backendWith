const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const { User } = require('./user')
const { Video } = require('./video')




const TaggingUser = sq.define('tagging_user', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Video,
            key: 'id'
        }
    },
    tagged_people_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
});


module.exports = TaggingUser
