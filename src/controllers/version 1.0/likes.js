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



module.exports = {
    addLike
}