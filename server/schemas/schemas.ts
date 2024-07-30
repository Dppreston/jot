const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String },
  username: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  creationDate: { type: Date, default: Date.now },
  likedPosts: { type: Array },
  dislikedPosts: { type: Array },
  savedPosts: { type: Array },
  likedComments: { type: Array },
  dislikedComments: { type: Array },
  favoriteCategories: { type: Array },
  notifications: { type: Array },
  profilePicture: { type: String },
  followers: { type: Array },
  following: { type: Array },
  bio: { type: String },
  profileImgVersion: { type: Number },
  pendingFollowers: { type: Array },
});

const newUserSensitiveSchema = new Schema({
  id: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  email: { type: String },
  parentUserId: { type: String },
  username: { type: String },
  creationDate: { type: Date, default: Date.now },
});

const newPostSchema = new Schema({
  id: { type: String },
  category: { type: String },
  title: { type: String },
  postBody: { type: String },
  headline: { type: String },
  userId: { type: String },
  likes: { type: Number },
  dislikes: { type: Number },
  likedUsers: { type: Array },
  dislikedUsers: { type: Array },
  savedUsers: { type: Array },
  creationDate: { type: Date, default: Date.now },
  commentCount: { type: Number },
  postImg: { type: String },
  postImgVersion: { type: Number },
});

const newCommentShema = new Schema({
  id: { type: String },
  userId: { type: String },
  postId: { type: String },
  creationDate: { type: Date, default: Date.now },
  commentBody: { type: String },
  commentLikes: { type: Number },
  commentDislikes: { type: Number },
  likedUsers: { type: Array },
  dislikedUsers: { type: Array },
  reply: { type: Boolean },
  replyCommentId: { type: String },
  commentParentId: { type: String },
});

const newUserPreferencesSchema = new Schema({
  id: { type: String },
  parentUserId: { type: String },
  darkMode: { type: Boolean },
  privateProfile: { type: Boolean },
});

const newMessageSchema = new Schema({
  id: { type: String },
  users: { type: Array },
  deletedUsers: { type: Array },
  unreadUsers: { type: Array },
  messages: { type: Array },
  creationDate: { type: Date, default: Date.now },
  active: { type: Boolean },
});

const newReportSchema = new Schema({
  id: { type: String },
  referenceId: { type: String },
  referenceUserId: { type: String },
  type: { type: String },
  reportReasons: { type: Array },
});

const JotReport = mongoose.model("JotReport", newReportSchema, "jot-reports");

const JotMessages = mongoose.model(
  "JotMessages",
  newMessageSchema,
  "jot-messages"
);
const JotPosts = mongoose.model("JotPosts", newPostSchema, "jot-posts");
const JotUsers = mongoose.model("JotUsers", userSchema, "jot-users");
const JotComments = mongoose.model(
  "JotComments",
  newCommentShema,
  "jot-comments"
);
const JotSensitive = mongoose.model(
  "JotSensitive",
  newUserSensitiveSchema,
  "jot-user-sensitive"
);
const JotPreferences = mongoose.model(
  "JotPreferences",
  newUserPreferencesSchema,
  "jot-user-preferences"
);

const mySchemas = {
  "JotUsers": JotUsers,
  "JotPosts": JotPosts,
  "JotComments": JotComments,
  "JotSensitive": JotSensitive,
  "JotPreferences": JotPreferences,
  "JotMessages": JotMessages,
  "JotReports": JotReport,
};

module.exports = mySchemas;
