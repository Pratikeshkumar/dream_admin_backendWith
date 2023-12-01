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
const GiftListing = require('./gift_listing')
const Promotion = require('./promotions')
const SuperadminTransaction = require('./superadmin_transaction');
const UserAdminTransaction = require('./admin_user_transaction')
const SuperAdminUserTransaction= require('./superAdmin_user_app_transaction')
const VideoReport = require('./VideoReport')
const UserFriendTransaction = require('./gift_user_friend_transation')



CommentRose.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
CommentRose.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
CommentRose.belongsTo(Video, { foreignKey: 'video_id', as: 'comment_rose_video' });
CommentRose.belongsTo(PostComment, { foreignKey: 'comment_id', as: 'comment' })

Video.hasMany(CommentRose, { foreignKey: 'video_id', as: 'comment_rose_video', onDelete: 'CASCADE' });

User.hasMany(Transaction, { foreignKey: 'user_id', sourceKey: 'id' })



Gift.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
Gift.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Gift.belongsTo(Video, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });

// Video.hasMany(Gift, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });






Like.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
Like.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Like.belongsTo(Video, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });



User.hasMany(Video, { foreignKey: "user_id" });
Video.hasMany(Like, { foreignKey: 'video_id', as: 'likes', onDelete: 'CASCADE' });
Video.belongsTo(User, { foreignKey: "user_id" });
User.belongsToMany(User, { as: 'Followers', through: UserRelationship, foreignKey: 'receiver_id' });
User.belongsToMany(User, { as: 'Following', through: UserRelationship, foreignKey: 'sender_id' });



PicturePost.belongsTo(User, { foreignKey: 'user_id' });

PostComment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})
PostComment.belongsTo(Video, {
  foreignKey: 'video_id',
  as: 'video',
  onDelete: 'CASCADE'
})
PostCommentReply.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

PostCommentReply.belongsTo(Video, {
  foreignKey: 'video_id',
  as: 'video',

});
// Video.hasMany(PostCommentReply, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });

PostCommentReply.belongsTo(PostComment, {
  foreignKey: 'parent_comment_id',
  as: 'parentComment',

});

PostComment.hasMany(PostCommentReply, { foreignKey: 'parent_comment_id', as: 'replies', onDelete: 'CASCADE' });

PostComment.hasMany(CommentLike, { foreignKey: 'comment_id', as: 'comment_likes', onDelete: 'CASCADE' });
CommentLike.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
CommentLike.belongsTo(User, { foreignKey: 'reciever_id', as: 'receiver' });
CommentLike.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });
CommentLike.belongsTo(PostComment, { foreignKey: 'comment_id', as: 'comment' });

PostComment.hasMany(CommentDisLike, { foreignKey: 'comment_id', as: 'comment_dislikes', onDelete: 'CASCADE' });
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
// User.hasMany(UserInteraction)
// UserInteraction.belongsTo(User)
User.hasMany(UserInteraction, { foreignKey: 'user_id' });
UserInteraction.belongsTo(User, { foreignKey: 'user_id' });



Video.hasMany(VideoView, { foreignKey: 'video_id', as: 'views' });
VideoView.belongsTo(Video, { foreignKey: 'video_id', as: 'views' })



Video.hasMany(PostComment, { foreignKey: 'video_id', as: 'comments', onDelete: 'CASCADE' });
PostComment.belongsTo(Video, { foreignKey: 'video_id' });



User.hasMany(Promotion, { foreignKey: 'user_id' })
Promotion.belongsTo(User, { foreignKey: 'user_id' })

Video.hasMany(Promotion, { foreignKey: 'video_id' })
Promotion.belongsTo(Video, { foreignKey: 'video_id' })


Admin.hasMany(SuperadminTransaction, {
  foreignKey: 'receiver_id',
  as: 'transactions',
});

SuperadminTransaction.belongsTo(Admin, {
  foreignKey: 'receiver_id',
});

UserAdminTransaction.belongsTo(Admin, { foreignKey: 'sender_id', as: 'sender' });
UserAdminTransaction.belongsTo(Admin, { foreignKey: 'receiver_id', as: 'receiver' });
SuperAdminUserTransaction.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
User.hasMany(SuperAdminUserTransaction, { foreignKey: 'receiver_id', as: 'superadminTransactions' });

VideoReport.belongsTo(User, { foreignKey: 'reporterId' })

Video.hasMany(VideoReport, { foreignKey: 'videoId' })
VideoReport.belongsTo(Video, { foreignKey: 'videoId' })

Transaction.belongsTo(User, { foreignKey: 'user_id'});

UserFriendTransaction.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
UserFriendTransaction.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });



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
  GiftListing,
  Promotion,
  SuperadminTransaction,
  UserAdminTransaction,
  VideoReport,
  UserFriendTransaction
};
