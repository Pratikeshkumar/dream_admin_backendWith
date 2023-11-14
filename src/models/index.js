const Admin = require("./admin");
const User = require("./user");
const UserFriend = require("./userFriend");
const Post = require("./post");
const Document = require("./document");
const Tag = require("./tags");
const Video = require("./video");
const VideoLike = require("./video_like");
const Like = require("./like");
const Gift = require("./gift");
const NewVideo = require('./newvideo')
const Country = require('./countries')
const City = require('./cities')
const Avatar = require('./avatar')
const Hobbies = require('./hobbies')
const Transaction = require('./transaction')
const UserRelationship = require('./releationship')
const PostComment = require('./comment')
const PostCommentReply = require('./commentReply')
const CommentLike = require('./commentLike')
const Message = require('./chat')
const MessageSubscription = require('./message_subscription')
const TaggingUser = require('./tagging_user')
const TaggingText = require('./tagging_text')
const VideoCity = require('./VideoCity')
const VideoCountry = require("./VideoCountry");
const UserInteraction = require('./user_interaction')
const CommentDisLike = require('./commentDislike')
const CommentRose = require('./commentRose')
const ProfileVisit = require('./profile_visit')
const Language = require('./language')
const VideoView = require('./video_view')
const PicturePost = require('./picture_post')
const Occupations = require('./occupations')
const Topic = require('./topic')
const LiveSettings = require('./live_settings')
const Promotion = require('./promotions')
const GiftListing = require('./gift_listing')
const liveStreamGiftStore = require('./liveStreamGiftStore')



CommentRose.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
CommentRose.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
CommentRose.belongsTo(Video, { foreignKey: 'video_id', as: 'comment_rose_video' });
CommentRose.belongsTo(PostComment, { foreignKey: 'comment_id', as: 'comment' })



User.hasMany(Transaction, { foreignKey: 'user_id', sourceKey: 'id' })



Gift.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
Gift.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Gift.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });







Like.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
Like.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Like.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });


Video.hasMany(VideoView, { foreignKey: 'video_id', as: 'views' })
VideoView.belongsTo(Video, { foreignKey: 'video_id', as: 'views' })

User.hasMany(VideoView)
VideoView.belongsTo(User)




User.hasMany(Video, { foreignKey: "user_id" });
Video.hasMany(Like, { foreignKey: 'video_id', as: 'likes' });
Video.belongsTo(User, { foreignKey: "user_id" });
User.belongsToMany(User, { as: 'Followers', through: UserRelationship, foreignKey: 'receiver_id' });
User.belongsToMany(User, { as: 'Following', through: UserRelationship, foreignKey: 'sender_id' });


PostComment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})
PostComment.belongsTo(Video, {
  foreignKey: 'video_id',
  as: 'video'
})
PostCommentReply.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

PostCommentReply.belongsTo(Video, {
  foreignKey: 'video_id',
  as: 'video',
});

PostCommentReply.belongsTo(PostComment, {
  foreignKey: 'parent_comment_id',
  as: 'parentComment',
});

PostComment.hasMany(PostCommentReply, { foreignKey: 'parent_comment_id', as: 'replies' });

PostComment.hasMany(CommentLike, { foreignKey: 'comment_id', as: 'comment_likes' });
CommentLike.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
CommentLike.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
CommentLike.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });
CommentLike.belongsTo(PostComment, { foreignKey: 'comment_id', as: 'comment' });

PostComment.hasMany(CommentDisLike, { foreignKey: 'comment_id', as: 'comment_dislikes' });
CommentDisLike.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
CommentDisLike.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
CommentDisLike.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });
CommentDisLike.belongsTo(PostComment, { foreignKey: 'comment_id', as: 'comment' });



Message.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
});

Message.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiverId",
  onDelete: "CASCADE",
});

Message.belongsTo(Message, {
  as: "parentMessage",
  foreignKey: "parentMessageId",
  onDelete: "CASCADE",
  foreignKeyConstraint: false,
});

Message.hasMany(Message, {
  as: "replies",
  foreignKey: "parentMessageId",
  onDelete: "CASCADE",
});

User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "receivedMessages",
});

User.hasMany(MessageSubscription, {
  foreignKey: 'reciever_id',
  as: 'subscriptionMessageReciver'
})


User.hasMany(MessageSubscription, {
  foreignKey: 'sender_id',
  as: 'subscriptionMessageSender'
})

MessageSubscription.belongsTo(User)

// HANDELING TAGGING RELATIONS
TaggingUser.belongsTo(Video, { foreignKey: 'post_id', as: 'video' });
TaggingUser.belongsTo(User, { foreignKey: 'tagged_people_id', as: 'taggedUser' });
TaggingText.belongsTo(Video, { foreignKey: 'post_id', as: 'video' })
TaggingText.belongsTo(Tag, { foreignKey: 'tagged_tags', as: 'taggedTags' })
VideoCity.belongsTo(Video, { foreignKey: 'post_id', as: 'video' });
VideoCity.belongsTo(City, { foreignKey: 'city_id', as: 'city' });
VideoCountry.belongsTo(Video, { foreignKey: 'post_id', as: 'video' });
VideoCountry.belongsTo(Country, { foreignKey: 'countriesId', as: 'country' });
User.hasMany(UserInteraction)
UserInteraction.belongsTo(User)




User.hasMany(LiveSettings, { foreignKey: 'user_id', as: 'user' })
LiveSettings.belongsTo(User, { foreignKey: 'user_id', as: 'user' })


User.hasMany(Promotion, { foreignKey: 'user_id' })
Promotion.belongsTo(User, { foreignKey: 'user_id' })

Video.hasMany(Promotion, { foreignKey: 'video_id' })
Promotion.belongsTo(Video, { foreignKey: 'video_id' })



module.exports = {
  Admin,
  User,
  Video,
  VideoLike,
  UserFriend,
  Post,
  Document,
  Tag,
  Like,
  Gift,
  NewVideo,
  Country,
  City,
  Avatar,
  Hobbies,
  Transaction,
  UserRelationship,
  CommentLike,
  PostComment,
  PostCommentReply,
  Message,
  MessageSubscription,
  TaggingUser,
  TaggingText,
  VideoCity,
  VideoCountry,
  UserInteraction,
  CommentDisLike,
  CommentRose,
  Language,
  ProfileVisit,
  VideoView,
  PicturePost,
  Occupations,
  Topic,
  LiveSettings,
  Promotion,
  GiftListing,
  liveStreamGiftStore
};