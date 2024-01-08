const logger = require('../../utils/logger');
const { User, Avatar, Transaction, Gift, Video, Like } = require("../../models");

const addLike = async (req, res, next) => {
    logger.info("Like: Like added to people");
    try {
        const {
            video_id,
            reciever_id,
            unlike
        } = req.body;
        const { id, email } = req.userData;
        const sender_id = id;

        let operationResult;
        if (unlike) {
            operationResult = await Like.destroy({
                where: {
                    video_id,
                    reciever_id,
                    sender_id
                }
            });
        } else {
            operationResult = await Like.create({
                video_id,
                reciever_id,
                sender_id
            });
        }

        if (!operationResult) {
            throw errorHandler("Unexpected error occurred while updating like!", "badRequest");
        }

        async function updateUserLike(userId, decrement = false) {
            try {
                const user = await Video.findByPk(userId);
                if (!user) {
                    console.log('User not found');
                    return;
                }

                const currentLike = user.like || 0;
                const newLike = decrement ? Math.max(currentLike - 1, 0) : currentLike + 1;

                const updated_like = await Video.update(
                    { like: newLike },
                    {
                        where: { id: video_id },
                    }
                );

                res.status(201).json({
                    message: 'transaction_successful',
                    updated_like
                });

                console.log('User likes updated successfully!');
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        if (unlike) {
            updateUserLike(video_id, true);
        } else {
            updateUserLike(video_id);
        }

    } catch (error) {
        logger.error(error);
    }
}


// FUNCTION FOR GETTING THE ALL LIKE OF A PARTICUALR USER
const getUserAllLike = async (req, res) => {
    logger.info('INFO -> GETTING ALL USER ALL LIKES API CALLED')
    try {
        const { user_id } = req.params;
        let result = await Like.count({
            where: { reciever_id: user_id }
        })
        res.status(201).json({
            message: 'success',
            no_of_likes: result
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'error while getting the likes of users, Please try again after some time' })
    }
}



const getAllLikeOfVideoByVideoId = async (req, res) => {
    logger.info('INFO -> GETTING ALL LIKE OF VIDEO BY VIDEO ID API CALLED')
    try {
        const { video_id } = req.params;
        let likes = await Like.findAll({
            where: { video_id: video_id }
        })
        likes = JSON.parse(JSON.stringify(likes))
        res.status(200).json({
            message: 'success',
            payload: likes
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'error generating while getting all like of the video', error })
    }
}


module.exports = {
    addLike,
    getUserAllLike,
    getAllLikeOfVideoByVideoId
}