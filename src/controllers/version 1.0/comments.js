const {
  PostComment,
  PostCommentReply,
  CommentLike,
  User,
  Video,
  CommentDisLike,
  CommentRose,

} = require('../../models');
const logger = require('../../utils/logger');
const errorHandler = require('../../utils/errorObject')



const createComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT CREATION API CALLED')
  try {
    let { id, email } = req.userData;
    let {
      video_id,
      comment_data,
    } = req.body;
    const user_id = id;
    const likes = 0;

    let comment = await PostComment.create({
      user_id,
      video_id,
      comment_data,
      likes
    })
    if (!comment) throw errorHandler('error while creating the comment')
    comment = JSON.parse(JSON.stringify(comment))
    res.status(201).json({
      message: 'successfully created',
      ...comment
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ response: 'error occured' })
  }
}


const fetchComment = async (req, res, next) => {
  logger.info('INFO -> GET ALL COMMENT OF POST CALLED');
  try {
    const { postId } = req.params;

    const comments = await PostComment.findAll({
      where: { video_id: postId },
      include: [
        {
          model: PostCommentReply,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'profile_pic', 'nickname'],
            },
            {
              model: Video,
              as: 'video',
              attributes: ['id', 'description', 'thum'],
            },
          ],
        },
        {
          model: CommentLike,
          as: 'comment_likes',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'profile_pic', 'nickname'],
            },
          ],
        },
        {
          model: CommentDisLike,
          as: 'comment_dislikes',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'profile_pic', 'nickname'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profile_pic', 'nickname'],
        },
        {
          model: Video,
          as: 'video',
          attributes: ['id', 'description', 'thum'],
        },
      ],
    });
    logger.info('INFO -> COMMENTS FETCHED SUCCESSFULLY');
    return res.status(200).json({ comments });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};




const replyComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT REPLY API CALLED')
  try {
    let { id, email } = req.userData;
    let user_id = id, likes = 0;
    const {
      video_id,
      parent_comment_id,
      reply_message
    } = req.body;

    let comment_reply = PostCommentReply.create({
      user_id,
      video_id,
      parent_comment_id,
      reply_message,
      likes
    })
    if (!comment_reply) throw errorHandler("error while creating the reply comment")
    res.status(201).json({
      message: 'replied successfully',
      ...comment_reply
    })

  } catch (error) {
    logger.error(error)
    res.status(500).json({ response: 'error occured' })
  }

}

const likeComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT LIKE API CALLED');
  try {
    const { id, email } = req.userData;
    const sender_id = id;
    const { video_id, reciever_id, comment_id } = req.body;


    const existingLike = await CommentLike.findOne({
      where: {
        sender_id: sender_id,
        comment_id: comment_id,
      },
    });

    if (existingLike) {
      return res.status(200).json({ message: 'You have already liked this comment.' });
    }

    const newLike = await CommentLike.create({
      video_id: video_id,
      reciever_id: reciever_id,
      sender_id: sender_id,
      comment_id: comment_id,
    });

    const comment = await PostComment.findByPk(comment_id);
    if (comment) {
      const newLikesCount = comment.likes + 1;
      await comment.update({ likes: newLikesCount });
    }

    logger.info('INFO -> COMMENT LIKED SUCCESSFULLY');
    return res.status(200).json({ message: 'Comment liked successfully.', like: newLike });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};


// FUNCTION FOR DISLIKING THE COMMENT 
const disLikeComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT LIKE API CALLED');
  try {
    const { id, email } = req.userData;
    const sender_id = id;
    const { video_id, reciever_id, comment_id } = req.body;


    const existingLike = await CommentDisLike.findOne({
      where: {
        sender_id: sender_id,
        comment_id: comment_id,
      },
    });

    if (existingLike) {
      return res.status(200).json({ message: 'You have already liked this comment.' });
    }

    const newLike = await CommentDisLike.create({
      video_id: video_id,
      reciever_id: reciever_id,
      sender_id: sender_id,
      comment_id: comment_id,
    });

    const comment = await PostComment.findByPk(comment_id);
    if (comment) {
      const newDisLikesCount = comment.dislike + 1;
      await comment.update({ dislike: newDisLikesCount });
    }

    logger.info('INFO -> COMMENT LIKED SUCCESSFULLY');
    return res.status(200).json({ message: 'Comment liked successfully.' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};


// FUNCTION FOR UNDISLIKING THE COMMENT
const unDISlikeComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT UNLIKE API CALLED');
  try {
    const { id } = req.userData;
    const sender_id = id;
    const { comment_id } = req.body;

    const existingLike = await CommentDisLike.findOne({
      where: {
        sender_id: sender_id,
        comment_id: comment_id,
      },
    });

    if (!existingLike) {
      return res.status(200).json({ message: 'You have not liked this comment.' });
    }

    await existingLike.destroy();

    const comment = await PostComment.findByPk(comment_id);
    if (comment && comment.dislike > 0) {
      const newDisLikesCount = comment.dislike - 1;
      await comment.update({ dislike: newDisLikesCount });
    }

    logger.info('INFO -> COMMENT UNLIKED SUCCESSFULLY');
    return res.status(200).json({ message: 'Comment unliked successfully.' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};



// FUNCTION FOR UNLINKING THE COMMENT
const unlikeComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT UNLIKE API CALLED');
  try {
    const { id } = req.userData;
    const sender_id = id;
    const { comment_id } = req.body;

    const existingLike = await CommentLike.findOne({
      where: {
        sender_id: sender_id,
        comment_id: comment_id,
      },
    });

    if (!existingLike) {
      return res.status(200).json({ message: 'You have not liked this comment.' });
    }

    await existingLike.destroy();

    const comment = await PostComment.findByPk(comment_id);
    if (comment && comment.likes > 0) {
      const newLikesCount = comment.likes - 1;
      await comment.update({ likes: newLikesCount });
    }

    logger.info('INFO -> COMMENT UNLIKED SUCCESSFULLY');
    return res.status(200).json({ message: 'Comment unliked successfully.' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};

const editComment = async (req, res, next) => {
  logger.info("INFO -> COMMENT EDITING API CALLED");
  try {
    const { comment_id, new_comment_data } = req.body;
    const { id: userId } = req.userData;
    const existingComment = await PostComment.findByPk(comment_id);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (existingComment.user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this comment.' });
    }

    await existingComment.update({ comment_data: new_comment_data });

    logger.info("INFO -> COMMENT EDITED SUCCESSFULLY");
    return res.status(200).json({ message: 'Comment edited successfully.', comment: existingComment });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};


const deleteComment = async (req, res, next) => {
  logger.info('INFO -> COMMENT DELETING API CALLED');
  try {
    const { comment_id } = req.body;
    const { id: userId } = req.userData;

    const existingComment = await PostComment.findByPk(comment_id, {
      include: [
        {
          model: PostCommentReply,
          as: 'parentComment',
        },
        {
          model: CommentLike,
          as: 'comment',
        },
      ],
    });

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (existingComment.user_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    await existingComment.destroy({ cascade: true });

    logger.info('INFO -> COMMENT DELETED SUCCESSFULLY');
    return res.status(200).json({ message: 'Comment and associated replies and likes deleted successfully.' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ response: 'An error occurred while processing the request.' });
  }
};




const sendRose = async (req, res) => {
  try {
    const {
      diamonds,
      video_id,
      reciever_id,
      comment_id
    } = req.body;

    const sender_id = req.userData.id;

    // Create a CommentRose instance
    const comment_rose = await CommentRose.create({
      diamonds,
      video_id,
      reciever_id,
      sender_id,
      comment_id
    });

    if (!comment_rose) {
      throw new Error('An error occurred while processing the request');
    }

    // Fetch sender's information
    const sender_user = await User.findByPk(sender_id);

    if (sender_user && sender_user.wallet >= diamonds) {
      // Deduct diamonds from sender's wallet
      sender_user.wallet -= diamonds;
      await sender_user.save();

      // Fetch receiver's information
      const reciever_user = await User.findByPk(reciever_id);

      if (reciever_user) {
        // Add diamonds to receiver's wallet
        reciever_user.wallet += diamonds;
        await reciever_user.save();
      }

      // Update the commented user's rose count
      const commented_user = await PostComment.findByPk(comment_id);

      if (commented_user) {
        commented_user.rose += 1;
        await commented_user.save();
      }

      return res.status(200).json({
        message: 'success'
      });
    } else {
      return res.status(400).json({
        message: `Sender doesn't have sufficient balance`
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: 'An error occurred while processing the request'
    });
  }
};



const getCommentOfVideoByVideoId = async (req, res) => {
  logger.info('INFO -> GETING ALL COMMENT OF VIDEO BY VIDEO ID API CALLED')
  try {
    const { video_id } = req.params;

    let comment = await PostComment.count({
      where: { video_id: video_id }
    })
    res.status(200).json({
      message: 'success',
      no_of_comment: comment
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "error generating while getting all comments", error })
  }

}














module.exports = {
  createComment,
  replyComment,
  likeComment,
  unlikeComment,
  editComment,
  deleteComment,
  fetchComment,
  disLikeComment,
  unDISlikeComment,
  sendRose,
  getCommentOfVideoByVideoId
}