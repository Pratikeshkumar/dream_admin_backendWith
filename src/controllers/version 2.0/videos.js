const { Video, Comment, CommentReply, Tag, Like, User, Gift, NewVideo, City, Country, VideoCountry, VideoCity, TaggingUser, TaggingText, PicturePost } = require("../../models");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const logger = require("../../utils/logger");
const errorHandler = require("../../utils/errorObject");
const sequelize = require('sequelize');
const { sq } = require('../../config/db');
const { s3 } = require('../../config/aws')
const {literal} = require('sequelize')

const uploadVideo = async (req, res, next) => {
  logger.info("INFO -> VIDEO UPLOADING API CALLED");
  try {
    const {
      caption,
      privacy,
      allow_comment,
      allow_duet,
      allow_stitch,
      countries,
      cities,
      hashtag,
      tag_people,
      tagged_people_id

    } = req.body;

    const { id, email, profile_pic } = req.userData;


    const video = req.files['video'] ? req.files['video'][0].originalname : null
    const image = req.files['cover'] ? req.files['cover'][0].originalname : null
    const videoPath = req.files['video'] ? req.files['video'][0].path : null
    const imagePath = req.files['cover'] ? req.files['cover'][0].path : null




    // CHECK WHEATHER THE TAG TEXT ARE EXISTED OR NOT IF NO THEN CREATE THE TAG, AND GET ID OF ALL TAG
    const checkAndCreateTags = async (tagsToCheck) => {
      const tagIds = [];

      for (const tagName of tagsToCheck) {
        try {
          const [tag, created] = await Tag.findOrCreate({
            where: { title: tagName },
            defaults: { title: tagName }, // Create the tag if it doesn't exist
          });

          tagIds.push(tag.id);
        } catch (error) {
          logger.error(`Error while processing tag "${tagName}":`, error);
        }
      }

      return tagIds;
    };

    const findUserIdsByUsername = async (usernames) => {
      const userIds = [];

      for (const username of usernames) {
        try {
          const user = await User.findOne({
            where: { username: username },
            attributes: ['id'],
          });

          if (user) {
            userIds.push(user.id);
          } else {
            userIds.push(null); // User not found, pushing null
          }
        } catch (error) {
          console.error(`Error while finding user "${username}":`, error);
          userIds.push(null); // Pushing null in case of error
        }
      }

      return userIds;
    };







    let addVideo = await Video.create({
      video: `videos/${video}`,
      thum: `images/${image}`,
      user_id: id,
      profile_pic: profile_pic,
      allow_comments: allow_comment,
      allow_duet: allow_duet,
      description: caption,
      allow_stitch: allow_stitch,
      view: 0,
      block: false,
      promote: false,
      like: 0,
      comment: 0,
      shared: 0,
      privacy_type: privacy ? 'private' : 'public'
    }); // adding into video db 
    const videoId = addVideo.id; // getting the id of video

    if (countries) {
      const countriesArray = countries.split(",").map(countryId => parseInt(countryId));
      let VideoCountry_result = await VideoCountry.bulkCreate(
        countriesArray.map(countryId => ({
          post_id: videoId,
          countriesId: countryId
        }))
      ) // adding the video country releationship to db 
    }

    if (cities) {
      const citiesArray = cities.split(",").map(cityId => parseInt(cityId));
      let CityCountry_result = await VideoCity.bulkCreate(
        citiesArray.map(cityId => ({
          post_id: videoId,
          city_id: cityId
        }))
      ) // adding video city association in db
    }



    if (tag_people) {
      const TaggedPeopleUsername = tag_people.split(",").map(text => text)
      const userId = await findUserIdsByUsername(TaggedPeopleUsername)
      let UserVideoResult = await TaggingUser.bulkCreate(
        userId.map(tagged_people_id => ({
          post_id: videoId,
          tagged_people_id: tagged_people_id
        }))
      ) // adding video user association in db 
    }




    if (tagged_people_id) {
      const TaggedPeopleId = tagged_people_id.split(",").map(id => parseInt(id))
      let UserVideoResult = await TaggingUser.bulkCreate(
        TaggedPeopleId.map(tagged_people_id => ({
          post_id: videoId,
          tagged_people_id: tagged_people_id
        }))
      ) // adding video user association in db 

    }




    if (hashtag) {
      const taggedText = hashtag.split(",",).map(text => text)
      const tagId = await checkAndCreateTags(taggedText)
      let UserTextResult = await TaggingText.bulkCreate(
        tagId.map(tagged_tags => ({
          post_id: videoId,
          tagged_tags: tagged_tags
        }))
      ) // adding video text association in db


    }





    addVideo = JSON.parse(JSON.stringify(addVideo))

    res.status(201).json({
      message: 'success',
      payload: addVideo
    })

    // uploading video to aws bucket
    const uploadVideo = {
      Bucket: 'dreamapplication',
      Key: `videos/${video}`,
      Body: fs.createReadStream(videoPath)
    };
    s3.upload(uploadVideo, (err, data) => {
      if (err) {
        logger.error('Error uploading video:', err);
      } else {
        logger.info('Video uploaded successfully:', data.Location);
        fs.unlink(videoPath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local video file deleted:', videoPath);
          }
        });
      }
    });



    // uploading image to aws bucket
    const uploadPicture = {
      Bucket: 'dreamapplication',
      Key: `images/${image}`,
      Body: fs.createReadStream(imagePath)
    };

    s3.upload(uploadPicture, (err, data) => {
      if (err) {
        logger.error('Error uploading picture:', err);
      } else {
        logger.info('picture uploaded successfully:', data.Location);
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local video file deleted:', videoPath);
          }
        });
      }
    });


  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error while uploading video. Please try again after some time' })
  }










  // try {
  //   let {
  //      user_id, caption, privacy, hideComment, duet,
  //   } = req.body, 




  // video = req.files['video'] ? req.files['video'][0].originalname : null,
  // image = req.files['cover'] ? req.files['cover'][0].originalname : null,
  // videoPath = req.files['video'] ? req.files['video'][0].path : null,
  // imagePath = req.files['cover'] ? req.files['cover'][0].path : null,
  // promises = [], uploadedVideo, uploadedImage;



  // console.log("file data:", req.files['video'][0].originalname)


  // console.log("file:", req.files)









  // if (!videoPath) throw errorHandler("data is not present in body", "badRequest");

  // uploadedVideo = await cloudinary.uploads(videoPath, "SocialMedia");
  // promises.push(fs.unlinkSync(videoPath));

  // if (imagePath) {
  //   uploadedImage = await cloudinary.uploads(imagePath, "SocialMedia");
  //   promises.push(fs.unlinkSync(imagePath));
  // }

  // let addVideo = await Video.create({
  //   cover: uploadedImage?.url || null,
  //   video: uploadedVideo.url, 
  //   user_id: user_id,
  //   allow_comment: hideComment,
  //   allow_duet: duet,
  //   description: caption,
  //   privacy_type: privacy
  // });
  // addVideo = JSON.parse(JSON.stringify(addVideo));

  // console.log(addVideo)
  // if (tags) {
  //   let allTags = tags.split(',');

  //   for (let i = 0; i < allTags?.length; i++) {
  //     dbObjectForTags.push({
  //       video_id: addVideo.id,
  //       title: allTags[i]
  //     });
  //   }

  // }
  // let videoTags = await Tag.bulkCreate(dbObjectForTags);
  // videoTags = JSON.parse(JSON.stringify(videoTags));

  //   await Promise.all(promises);

  //   res.status(201).json({
  //     success: true,
  //     message: "Video posted successfully!",
  //     payload: {
  //       ...video,
  //       // tags: videoTags
  //     }
  //   });
  // } catch (error) {
  //   logger.error(error);

  //   return next(error);
  // }
};

const allVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET ALL VIDEOS API CALLED");
  try {
    const videos = await Video.findAll({
      where: {
        status: "public"
      },
      include: [
        {
          model: Comment,
          as: "comments",
        },
        {
          attributes: {
            exclude: ["first_name", "last_name", "password"]
          },
          model: User,
          as: "user"
        }
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};


const getMyVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET MY VIDEO BY FILTERS API CALLED");
  try {
    let { id, email } = req.userData;

    const videos = await Video.findAll({
      where: { user_id: id }
    })

    if (videos) {
      res.status(201).json(videos)
    }
  } catch (error) {
    logger.err(error)
  }
}





const getVideo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET VIDEO BY FILTERS API CALLED");
  try {
    let { video_id, user_id, status } = req.query,
      condition = {};

    video_id && (condition.id = video_id);
    user_id && (condition.user_id = user_id);
    status && (condition.status = status);

    const videos = await Video.findAll({
      where: condition,
      include: [
        {
          as: "comments",
          model: Comment,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const getAllUserVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET ALL USER VIDEOS API CALLED");
  try {
    const page = parseInt(req.query.page, 10) || 1; // Get the requested page (default to 1 if not provided)
    const pageSize = parseInt(req.query.pageSize, 10) || 5; // Get the number of items per page (default to 5 if not provided)

    // Calculate the offset based on the page and page size
    const offset = (page - 1) * pageSize;

    // Query for random videos with pagination
    const videos = await Video.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profile_pic', 'bio', 'nickname', 'instagram', 'you_tube', 'facebook'],
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'reciever_id', 'sender_id'],
        },
      ],
      limit: pageSize,
      offset,
      order: literal('RAND()'), 
    });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched random videos!",
      videos: videos.rows,
      totalVideos: videos.count,
      currentPage: page,
      pageSize: pageSize,
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};









const getUserPostedImages = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GET ALL USER POSTED IMAGES API CALLED");
  try {
    let { status } = req.query,
      condition = {};

    condition.status = status;
    condition.type = "image";

    const videos = await Video.findAll({
      where: condition,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched images!",
      images: videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const updateVideo = (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: UPDATE VIDEO API CALLED");
  try {

  } catch (error) {

  }
};

const deleteVideo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: DELETE VIDEO API CALLED");
  try {
    let { id } = req.params;

    const video = await Video.destroy({
      where: { id },
    });

    if (!video) throw errorHandler("Video not found!", "notFound");

    return res.status(200).json({
      success: true,
      message: "Video successfully deleted!"
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const likeVideo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: LIKE VIDEO API CALLED");
  try {
    let { video_id } = req.params,
      { status } = req.body,
      user_id = req.userData.id,
      { like_id } = req.query,
      dbPayload = {
        video_id,
        user_id,
        status
      };

    like_id && (dbPayload.id = like_id);

    let liked = await Like.upsert(dbPayload);
    // liked = JSON.parse(JSON.stringify(liked));

    if (!liked) throw errorHandler("Unexpected error occured while liking video!", "notFound");

    let totalVideoLikes = await Like.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_likes'],
      ],
      where: { id: video_id },
      group: ['video_id']
    });
    totalVideoLikes = JSON.parse(JSON.stringify(totalVideoLikes));

    return res.status(200).json({
      success: true,
      message: status === true ? "Liked video successfully!" : "Disliked video successfully!",
      payload: {
        liked,
        totalVideoLikes: totalVideoLikes[0]?.total_likes
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const commentVideo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: COMMENT VIDEO API CALLED");
  try {
    let { video_id } = req.params,
      { comment } = req.body,
      user_id = req.userData.id;

    let commented = await Comment.create({
      video_id, comment, user_id
    });
    // commented = JSON.parse(JSON.stringify(commented));

    if (!commented) throw errorHandler("Unexpected error occured while commenting on video!", "notFound");

    let totalComments = await Comment.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_comments']
      ],
      where: { video_id },
      group: ['video_id'],
      distinct: true
    });
    totalComments = JSON.parse(JSON.stringify(totalComments));

    return res.status(200).json({
      success: true,
      message: "Commented on video successfully!",
      payload: {
        comment: commented,
        totalComments: totalComments[0]?.total_comments
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const replyComment = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: REPLY COMMENT VIDEO API CALLED");
  try {
    let { comment_id } = req.params,
      { reply } = req.body,
      user_id = req.userData.id;

    let replied = await CommentReply.create({
      comment_id, reply, user_id
    });
    replied = JSON.parse(JSON.stringify(replied));

    if (!replied) throw errorHandler("Unexpected error occured while replying comment on video!", "notFound");

    let totalComments = await Comment.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_comments']
      ],
      where: { video_id },
      group: ['video_id'],
      distinct: true
    });
    totalComments = JSON.parse(JSON.stringify(totalComments));

    return res.status(200).json({
      success: true,
      message: "Commented on video successfully!",
      payload: {
        reply: replied,
        totalComments: totalComments[0]
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const userInvolvedVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: USER INVOLVED VIDEOS API CALLED");
  try {
    let user_id = req.userData.id;

    let userLikedVideos = await Video.findAll({
      attributes: ['id', 'video'],
      include: [
        {
          where: { user_id },
          model: Like,
          as: "likes"
        },
      ]
    });

    let userCommentedVideos = await Video.findAll({
      attributes: ['id', 'video'],
      include: [
        {
          where: { user_id },
          required: true,
          model: Comment,
          as: "comments"
        },
      ]
    });

    userLikedVideos = JSON.parse(JSON.stringify(userLikedVideos));
    userCommentedVideos = JSON.parse(JSON.stringify(userCommentedVideos));


    return res.status(200).json({
      success: true,
      message: "User Involved videos fetched successfully!",
      payload: {
        userLikedVideos,
        userCommentedVideos
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const userInvolvedVideosById = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: USER INVOLVED VIDEOS BY ID API CALLED");
  try {
    let { user_id } = req.params;

    let userLikedVideos = await Video.findAll({
      attributes: ['id', 'video'],
      include: [
        {
          where: { user_id },
          model: Like,
          as: "likes"
        },
      ]
    });

    let userCommentedVideos = await Video.findAll({
      attributes: ['id', 'video'],
      include: [
        {
          where: { user_id },
          required: true,
          model: Comment,
          as: "comments"
        },
      ]
    });

    userLikedVideos = JSON.parse(JSON.stringify(userLikedVideos));
    userCommentedVideos = JSON.parse(JSON.stringify(userCommentedVideos));


    return res.status(200).json({
      success: true,
      message: "User Involved videos fetched successfully!",
      payload: {
        userLikedVideos,
        userCommentedVideos
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const allComments = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: VIDEO ALL COMMENTS API CALLED");
  try {
    let { video_id } = req.params;

    let videoComments = await Video.findOne({
      attributes: ['id', 'video'],
      where: { id: video_id },
      include: [
        {
          model: Comment,
          as: "comments",
          include: {
            model: User,
            as: "user"
          }
        },
      ]
    });
    videoComments = JSON.parse(JSON.stringify(videoComments));

    if (!videoComments) throw errorHandler("Video does not exist!", "notFound");

    let totalComments = await Comment.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_comments']
      ],
      where: { video_id },
      group: ['video_id'],
      distinct: true
    });
    totalComments = JSON.parse(JSON.stringify(totalComments));
    videoComments.totalComments = totalComments[0]?.total_comments || 0;


    return res.status(200).json({
      success: true,
      message: "Video all comments fetched successfully!",
      payload: videoComments
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const giftVideo = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: GIFT VIDEO API CALLED");
  try {
    let data = req.body,
      {
        to_video_id, num_of_diamonds
      } = data,
      reciever_id = data.to_user_id,
      sender_id = req.userData.id,
      user_diamonds = req.userData.diamonds;

    if (num_of_diamonds >= user_diamonds) throw errorHandler("You don't have enough diamonds!", "badRequest");

    let gift = await Gift.create({
      sender_id, reciever_id, video_id: to_video_id, diamonds: num_of_diamonds
    });
    gift = JSON.parse(JSON.stringify(gift));

    if (!gift) throw errorHandler("Unexpected error occured giving diamonds to video!", "badRequest");

    let user = await User.findOne({ where: { id: sender_id } });
    user.diamonds = user.diamonds - num_of_diamonds;
    user.save();

    let total_diamonds_gifted_to_video = await Gift.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('diamonds')), 'total_diamonds_gifted_to_video']
      ],
      where: { video_id: to_video_id },
      group: ['video_id']
    });
    total_diamonds_gifted_to_video = JSON.parse(JSON.stringify(total_diamonds_gifted_to_video));

    console.log(total_diamonds_gifted_to_video)

    return res.status(200).json({
      success: true,
      message: "Gifted diamonds successfully!",
      payload: {
        video_id: to_video_id,
        diamonds_gifted: num_of_diamonds,
        total_diamonds_gifted_to_video:
          parseInt(total_diamonds_gifted_to_video[0]?.total_diamonds_gifted_to_video) + parseInt(num_of_diamonds),
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const searchAllVideos = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: SEARCH ALL VIDEOS BY KEYWORD API CALLED");
  try {
    let { keyword } = req.query;

    const videos = await Video.findAll({
      attributes: ['id', 'video'],
      where: {
        status: "public",
        // keyword filter has to be added
      },
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const searchVideosFromProfile = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: SEARCH PROFILE VIDEOS BY KEYWORD API CALLED");
  try {
    let { keyword, status } = req.query,
      user_id = req.userData.id,
      condition = {};

    status && (condition.status = status);
    condition.user_id = user_id;

    const videos = await Video.findAll({
      attributes: ['id', 'video'],
      where: condition,
    });

    return res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const videoStats = async (req, res, next) => {
  logger.info("VERSION 2.0 -> VIDEO: VIDEO STATS BY ID API CALLED");
  try {
    let { video_id } = req.params,
      user_id = req.userData.id;

    let video = await Video.findAll({
      include: [
        {
          required: false,
          attributes: [
            [sequelize.fn("COUNT", sequelize.col('video_id')), "total_likes"]
          ],
          where: { video_id, status: true },
          model: Like,
          as: "likes"
        },
        {
          attributes: {
            exclude: ['firebase_uid']
          },
          model: User,
          as: "user"
        }
      ],
      group: ['video_id']
    });
    // video = JSON.parse(JSON.stringify(video));


    let liked = await Like.findOne({
      attributes: [
        ['status', 'did_liked_before']
      ],
      where: { user_id, video_id }
    })
    // liked = JSON.parse(JSON.stringify(liked));

    let gift = await Gift.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col('gift.diamonds')), "total_diamonds_gifted"]
      ],
      where: { video_id },
      group: ['video_id']
    });
    // gift = JSON.parse(JSON.stringify(gift));

    return res.status(200).json({
      success: true,
      message: "Video stats successfully!",
      payload: {
        ...video[0],
        ...gift[0],
        ...liked
      }
    });
  } catch (error) {
    logger.error(error);

    return next(error);
  }
};

const getUserPersonalInteractedVideo = async (req, res) => {
  logger.info('INFO -> GETTING USER PERSONAL INTERACTED VIDEO')
  try {
    const { id } = req.userData;
    // const result = await 
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error generating while getting the list of video', error })
  }
}



const uploadPicturePost = async (req, res) => {
  logger.info('INFO -> UPLOADING PICTURE POST API CALLED')
  try {
    const {
      caption,
      view,
      privacy_type,
      like,
      comment,
      shared } = req.body;
    const image = req.files['images'] ? req.files['images'][0].originalname : null
    const imagePath = req.files['images'] ? req.files['images'][0].path : null
    const { id } = req.userData;

    // uploading image to aws bucket
    const uploadPicture = {
      Bucket: 'dreamapplication',
      Key: `images/${image}`,
      Body: fs.createReadStream(imagePath)
    };

    let result = await PicturePost.create({
      user_id: id,
      description: caption,
      view: 0,
      privacy_type,
      like: 0,
      comment: 0,
      shared: 0,
      image_url: `images/${image}`
    })

    result = JSON.parse(JSON.stringify(result))

    console.log(result)

    res.status(200).json({
      message: 'successfully uploaded',
      payload: result
    })

    s3.upload(uploadPicture, (err, data) => {
      if (err) {
        logger.error('Error uploading picture:', err);
      } else {
        logger.info('picture uploaded successfully:', data.Location);
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            logger.error('Error deleting local video file:', unlinkErr);
          } else {
            logger.info('Local video file deleted:', imagePath);
          }
        });
      }
    });

  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error generated while uploading the picture post', error })
  }

}




const getAllPicturePost = async (req, res) => {
  logger.info('INFO -> GETTING ALL PICTURE POST API CALLED')
  try {
    const { user_id } = req?.params;

    let result = await PicturePost.findAll({
      where: { user_id }
    })
    result = JSON.parse(JSON.stringify(result))

    res.status(200).json({
      message: 'success',
      payload: result
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: 'error generated while uploading picture post', error })
  }
}
















module.exports = {
  uploadVideo,
  allVideos,
  getVideo,
  updateVideo,
  getAllUserVideos,
  deleteVideo,
  likeVideo,
  commentVideo,
  replyComment,
  userInvolvedVideos,
  allComments,
  giftVideo,
  getUserPostedImages,
  searchAllVideos,
  searchVideosFromProfile,
  userInvolvedVideosById,
  videoStats,
  getMyVideos,
  uploadPicturePost,
  getAllPicturePost
};


const user = require('assert')

