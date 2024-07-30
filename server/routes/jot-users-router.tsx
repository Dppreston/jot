let express = require("express");
let usersRouter = express.Router();
let schemas = require("../schemas/schemas.ts");
let React = require("react");
let cloudinary = require("cloudinary").v2;

//users GET

usersRouter.get("/jot-users", async (req, res) => {
  const users = schemas.JotUsers;

  //queries

  const {
    userSearch,
    searchQuery,
    recommendedUsers,
    home,
    userId,
    userFavorites,
    homeFavorites,
    userCheck,
    userCheckData,
    postTile,
    postUser,
    userFinal,
    postUserId,
    savedCheck,
    dashboard,
    globalNotifications,
    userProfileUser,
    profilePicFetch,
    username,
    likerUsername,
    reportUsername,
    fetchNoti,
    fetchCommentUsername,
    commentUser,
    usernameForSensitive,
    followingCheck,
    profileId,
    totalFollowersFollowing,
    notificationPopupCheck,
    memberSince,
    searchAllUsername,
    loadMoreUsers,
    userDynamicLength,
    searchAll,
    followers,
    imgVersion,
    loggedOutRecommendedUsers,
    followRequestCheck,
    receivingUserId,
    followRequestAlert,
    userProfileId,
    followRequestUsernames,
    fetchFF,
    FFOption,
    profileSet,
  } = req.query;

  //GLOBAL notificaion check

  if (globalNotifications) {
    const userCheck = await users.find({ _id: userId }).exec();
    if (userCheck) {
      const readCheck = userCheck.map((data) =>
        data.notifications.filter((noti) => noti.read == false)
      );

      if (readCheck != undefined) {
        return res.send(JSON.stringify(readCheck));
      }
    }
    res.end();
  }

  if (usernameForSensitive) {
    const userId = await users.find({ username: username }, { _id: 1 }).exec();
    if (userId) {
      return res.send(JSON.stringify(userId));
    }
  }

  //notification popup check

  if (notificationPopupCheck) {
    const user = await users.find({ _id: userId });
    const notificationCheck = user[0].notifications;

    if (notificationCheck.length > 0) {
      return res.send(true);
    }
    res.end();
  }

  //home favorites

  if (homeFavorites) {
    const homeFavorites = await users.find({ _id: userId }).exec();
    if (homeFavorites) {
      return res.send(JSON.stringify(homeFavorites));
    }
    res.end();
  }

  //dashbaord user

  if (dashboard) {
    const userData = await users.find({ _id: userId }).exec();

    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //post save check

  if (savedCheck) {
    const userCheck = await users.find({ _id: userId }).exec();
    const check = userCheck[0]?.savedPosts.map((post) => {
      return post;
    });

    if (check) {
      return res.send(JSON.stringify(check));
    }
    res.end();
  }

  //final post user

  if (userFinal) {
    const userData = await users.find({ _id: postUserId }).exec();

    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //tile post user data

  if (postTile) {
    const userData = await users.find({ _id: postUser }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //home user check

  if (userFavorites) {
    const userData = await users.find({ _id: userId }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }

    res.end();
  }

  if (home) {
    const userData = await users.find({ _id: userId }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //username check

  if (userCheck) {
    const userCheckConfirm = await users
      .find({ username: userCheckData })
      .exec();

    if (userCheckConfirm != "") {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //fetch comment username

  if (fetchCommentUsername) {
    const userData = await users.find({ _id: commentUser }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //fetch notifications

  if (fetchNoti) {
    const notiData = await users.find({ _id: userId }).exec();
    if (notiData) {
      return res.send(JSON.stringify(notiData));
    }
    res.end();
  }

  //notiUsername

  if (likerUsername) {
    const username = await users.find({ _id: userId }).exec();
    if (username) {
      return res.send(JSON.stringify(username));
    }
    res.end();
  }

  //user profile data fetch

  if (userProfileUser) {
    const userData = await users.find({});
    const foundUser = userData.find((el) => el._id == userId);

    if (foundUser != undefined) {
      return res.send(JSON.stringify([foundUser]));
    } else {
      return res.send(JSON.stringify(null));
    }
  }

  //total followers and following

  if (totalFollowersFollowing) {
    const user = await users.find({ _id: userId }).exec();
    if (user) {
      const followerSum = user[0].followers.length;
      const followingSum = user[0].following.length;

      return res.send([followerSum, followingSum]);
    }
    res.end();
  }

  //following check

  if (followingCheck) {
    const userData = await users.find({ _id: userId }).exec();
    const followCheck = userData[0].following.find((id) => id == profileId);

    if (followCheck != undefined) {
      return res.send(true);
    } else {
      return res.send(false);
    }
    res.end();
  }

  //follow request check FOLLOW BUTTON

  if (followRequestCheck) {
    const user = await users.find({ _id: receivingUserId }).exec();

    const requestCheck = user[0]?.pendingFollowers.find((id) => id == userId);

    if (requestCheck != undefined) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  // follow request check alert profile

  if (followRequestAlert) {
    const user = await users.find({ _id: userId });

    if (userProfileId != "undefined") {
      const foundSingleRequest = user[0]?.pendingFollowers.find(
        (el) => el == userProfileId
      );
      if (foundSingleRequest) {
        const userData = await users.find(
          { _id: foundSingleRequest },
          { username: 1 }
        );
        return res.send(JSON.stringify(userData));
      } else {
        return res.send(undefined);
      }
    } else {
      let userIds = user[0].pendingFollowers;
      let finalUserData = new Array();

      for (let i = 0; i < userIds.length; i++) {
        const userData = await users.find({ _id: userIds[i] }, { username: 1 });
        finalUserData.push(...userData);
      }

      if (finalUserData.length > 0) {
        return res.send(JSON.stringify(finalUserData));
      } else {
        return res.send(undefined);
      }
    }
  }

  //request username fetch
  if (followRequestUsernames) {
    const username = await users.find({ _id: userId }, { username: 1 }).exec();
    if (username) {
      return res.send(JSON.stringify(username[0].username));
    }
  }

  //creation date

  if (memberSince) {
    const creationDate = await users
      .find({ _id: userId }, { creationDate: 1 })
      .exec();
    if (creationDate) {
      return res.send(JSON.stringify(creationDate));
    }
    res.end();
  }

  //recommended users

  if (recommendedUsers) {
    let allUsers = await users.find({}).exec();

    const userFollowing = await users
      .find({ _id: userId }, { following: 1 })
      .exec();

    //4 random users that you arent following

    let currentIndex = allUsers.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [allUsers[currentIndex], allUsers[randomIndex]] = [
        allUsers[randomIndex],
        allUsers[currentIndex],
      ];
    }

    const usersNotFollowing = allUsers.filter(
      (data) =>
        !userFollowing[0].following.some((users) =>
          users.includes(data._id.toString())
        )
    );

    return res.send(
      JSON.stringify(
        usersNotFollowing
          .filter((el) => el._id.toString() !== userId)
          .slice(0, 5)
      )
    );
  }

  //logged out recommended users

  if (loggedOutRecommendedUsers) {
    let allUsers = await users.find({}).exec();

    let currentIndex = allUsers.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [allUsers[currentIndex], allUsers[randomIndex]] = [
        allUsers[randomIndex],
        allUsers[currentIndex],
      ];
    }

    return res.send(allUsers.slice(0, 5));
  }

  //search all username

  if (searchAllUsername) {
    const userData = await users.find({ _id: userId }, { username: 1 }).exec();
    if (userData) {
      return res.send(JSON.stringify(userData));
    }
    res.end();
  }

  //SEARCH

  //user search

  if (userSearch) {
    const userData = await users
      .find({}, { username: 1, profilePicture: 1, profileImgVersion: 1 })
      .exec();
    const split = searchQuery.toLowerCase().split();

    const filtered = userData.filter((word) =>
      split.every((char) => word.username.toLowerCase().includes(char))
    );

    if (filtered && searchAll == "true") {
      return res.send([filtered.slice(0, 6), filtered.length]);
    } else {
      return res.send([filtered.slice(0, 4), filtered.length]);
    }
  }

  //load more users

  if (loadMoreUsers) {
    const userData = await users
      .find({}, { username: 1, profilePicture: 1 })
      .exec();
    const split = searchQuery.toLowerCase().split();

    const filtered = userData.filter((word) =>
      split.every((char) => word.username.toLowerCase().includes(char))
    );

    if (filtered) {
      return res.send([
        filtered.slice(0, parseInt(userDynamicLength) + 6),
        filtered.length,
      ]);
    }
    res.end();
  }

  //folowers

  if (followers) {
    const followerData = await users
      .find({ _id: userId }, { followers: 1 })
      .exec();
    if (followerData) {
      return res.send(JSON.stringify(followerData));
    }
    res.end();
  }

  //fetch FF

  if (fetchFF) {
    const user = await users.find({ _id: userId }).exec();
    const userFollowerIds = user[0]?.followers;
    const userFollowingIds = user[0]?.following;

    if (FFOption == 1) {
      const userFollowerArr = new Array();

      //fetch all follower profiles

      for (let i = 0; i < userFollowerIds.length; i++) {
        const action = await users
          .find(
            { _id: userFollowerIds[i] },
            { username: 1, profileImgVersion: 1 }
          )
          .exec();
        if (action) {
          for (let i = 0; i < action.length; i++) {
            const profilePic = cloudinary.url(action[i].username);
            userFollowerArr.push({
              _id: action[i]._id,
              username: action[i].username,
              profilePicUrl: profilePic,
              profileImgVersion: action[i].profileImgVersion,
            });
          }
        }
      }

      if (userFollowerArr.length != 0) {
        return res.send(JSON.stringify(userFollowerArr));
      } else {
        return res.send(false);
      }
    }

    if (FFOption == 2) {
      const userFollowingArr = new Array();

      //fetch all follower profiles

      for (let i = 0; i < userFollowingIds.length; i++) {
        const action = await users
          .find(
            { _id: userFollowingIds[i] },
            { username: 1, profileImgVersion: 1 }
          )
          .exec();
        if (action) {
          for (let i = 0; i < action.length; i++) {
            const profilePic = cloudinary.url(action[i].username);
            userFollowingArr.push({
              _id: action[i]._id,
              username: action[i].username,
              profilePicUrl: profilePic,
              profileImgVersion: action[i].profileImgVersion,
            });
          }
        }
      }

      if (userFollowingArr.length != 0) {
        return res.send(JSON.stringify(userFollowingArr));
      } else {
        return res.send(false);
      }
    }
  }

  const { searchFF, ffSearchContent } = req.query;

  //search FF

  if (searchFF) {
    const user = await users.find({ _id: userId }).exec();
    const userFollowerIds = user[0]?.followers;
    const userFollowingIds = user[0]?.following;

    if (FFOption == 1) {
      const userFollowerArr = new Array();

      //fetch all follower profiles

      for (let i = 0; i < userFollowerIds.length; i++) {
        const action = await users
          .find(
            { _id: userFollowerIds[i] },
            { username: 1, profileImgVersion: 1 }
          )
          .exec();
        if (action) {
          for (let i = 0; i < action.length; i++) {
            const profilePic = cloudinary.url(action[i].username);
            userFollowerArr.push({
              _id: action[i]._id,
              username: action[i].username,
              profilePicUrl: profilePic,
              profileImgVersion: action[i].profileImgVersion,
            });
          }
        }
      }

      //search Usernames

      const split = ffSearchContent.toLowerCase().split();

      const filtered = userFollowerArr.filter((word) =>
        split.every((char) => word.username.toLowerCase().includes(char))
      );

      if (filtered) {
        return res.send(JSON.stringify(filtered));
      }
    }

    if (FFOption == 2) {
      const userFollowingArr = new Array();

      //fetch all follower profiles

      for (let i = 0; i < userFollowingIds.length; i++) {
        const action = await users
          .find(
            { _id: userFollowingIds[i] },
            { username: 1, profileImgVersion: 1 }
          )
          .exec();
        if (action) {
          for (let i = 0; i < action.length; i++) {
            const profilePic = cloudinary.url(action[i].username);
            userFollowingArr.push({
              _id: action[i]._id,
              username: action[i].username,
              profilePicUrl: profilePic,
              profileImgVersion: action[i].profileImgVersion,
            });
          }
        }
      }

      //search Usernames

      const split = ffSearchContent.toLowerCase().split();

      const filtered = userFollowingArr.filter((word) =>
        split.every((char) => word.username.toLowerCase().includes(char))
      );

      if (filtered) {
        return res.send(JSON.stringify(filtered));
      }
    }
  }

  //profile Settings

  if (profileSet) {
    const settingsData = await users
      .find(
        { _id: userId },
        {
          bio: 1,
          favoriteCategories: 1,
          username: 1,
          profileImgVersion: 1,
          profilePicture: 1,
        }
      )
      .exec();
    if (settingsData) {
      return res.send(JSON.stringify(settingsData));
    }
  }

  //new message user search

  const { newMessageUserSearch, messageUsername } = req.query;

  if (newMessageUserSearch) {
    const allUser = await users
      .find({}, { username: 1, profileImgVersion: 1 })
      .exec();
    const userSearchArr = new Array();

    if (allUser) {
      for (let i = 0; i < allUser.length; i++) {
        const profilePic = cloudinary.url(allUser[i].username);
        userSearchArr.push({
          _id: allUser[i]._id,
          username: allUser[i].username,
          profilePicUrl: profilePic,
          profileImgVersion: allUser[i].profileImgVersion,
        });
      }

      //search Usernames

      const split = searchQuery.toLowerCase().split();

      const filtered = userSearchArr.filter((word) =>
        split.every((char) => word.username.toLowerCase().includes(char))
      );

      if (filtered) {
        return res.send(
          JSON.stringify(filtered.filter((el) => el._id != userId).splice(0, 5))
        );
      }
    }

    if (imgVersion) {
      const data = await users
        .find({ _id: userId }, { profileImgVersion: 1 })
        .exec();
      if (data) {
        return res.send(JSON.stringify(data));
      } else {
        return res.send(false);
      }
    }
  }

  //message username

  const { convoStarterId } = req.query;

  if (messageUsername) {
    const username = await users
      .find(
        { _id: userId },
        { username: 1, profileImgVersion: 1, profilePicture: 1 }
      )
      .exec();

    const convoStarterUsername = await users
      .find({ _id: convoStarterId }, { username: 1 })
      .exec();

    if (username) {
      return res.send(JSON.stringify([username, convoStarterUsername]));
    }
  }

  if (reportUsername) {
    const action = await users.find({ _id: userId }, { username: 1 }).exec();

    if (action) {
      return res.send(JSON.stringify(action));
    } else {
      return res.send(false);
    }
  }

  const { imgDetails } = req.query;

  if (imgDetails) {
    const data = await users.find(
      { _id: userId },
      { profilePicture: 1, profileImgVersion: 1 }
    );
    if (data) {
      return res.send(JSON.stringify(data));
    } else {
      return res.send(false);
    }
  }
});

//users PUT

usersRouter.put("/jot-users", async (req, res) => {
  const users = schemas.JotUsers;

  //queries

  const {
    userLike,
    userId,
    postId,
    userDislike,
    following,
    follower,
    currentUserId,
    deleteNotification,
    readChange,
    notiId,
    commentLikeNoti,
    commentUserId,
    cancelFollowRequest,
    username,
    likerId,
    clearPostData,
    deletedComment,
    commentDislike,
    commentLike,
    commentId,
    commentDisLikeNoti,
    idsToDelete,
    bioUpdate,
    updatedBio,
    updatedFavorites,
    updateFavoriteCategories,
    followRequest,
    receivingUserId,
    confirmFollowRequest,
    requestUserId,
    rejectFollowRequest,
    notification,
    referenceUserId,
    referenceId,
    type,
  } = req.query;

  const userCheck = await users.find({ _id: userId }).exec();

  // add / remove like to user

  if (userLike) {
    const userPostCheck = userCheck[0]?.likedPosts.find((posts) => {
      return posts == postId;
    });

    if (userPostCheck) {
      const removeLikeFromUser = await users.updateOne(
        { _id: userId },
        {
          $pull: { likedPosts: postId },
        }
      );
      if (removeLikeFromUser) {
        return res.send(false);
      }
    } else {
      const addLikeToUser = await users.updateOne(
        { _id: userId },
        {
          $push: { likedPosts: postId },
        }
      );
      if (addLikeToUser) {
        return res.send(true);
      }
    }
    res.end();
  }

  // add / remove dislike to user

  if (userDislike) {
    const userCheck = await users.find({ _id: userId }).exec();

    const userPostCheck = userCheck[0]?.dislikedPosts.find((posts) => {
      return posts == postId;
    });
    if (userPostCheck) {
      const removeLikeFromUser = await users.updateOne(
        { _id: userId },
        {
          $pull: { dislikedPosts: postId },
        }
      );
      if (removeLikeFromUser) {
        return res.send(false);
      }
    } else {
      const addDislikedToUser = await users.updateOne(
        { _id: userId },
        {
          $push: { dislikedPosts: postId },
        }
      );
      if (addDislikedToUser) {
        return res.send(true);
      }
    }
    res.end();
  }

  //saved post functionality

  const { save } = req.query;

  if (save) {
    const userDetection = await users.find({ _id: userId }).exec();
    const saveDetection = userDetection[0]?.savedPosts.find((post) => {
      return post == postId;
    });

    if (saveDetection) {
      const unsavePost = await users.updateOne(
        { _id: userId },
        {
          $pull: { savedPosts: postId },
        }
      );
      if (unsavePost) {
        return res.send(false);
      }
    } else {
      const savePost = await users.updateOne(
        { _id: userId },
        {
          $push: { savedPosts: postId },
        }
      );
      if (savePost) {
        return res.send(true);
      }
    }
    res.end();
  }

  //user comment like storage

  if (commentLike) {
    const userCheck = await users.find({ _id: userId }).exec();
    const commentCheck = userCheck[0]?.likedComments?.find((id) => {
      return id == commentId;
    });

    if (commentCheck == undefined) {
      const addCommentLike = await users.updateOne(
        { _id: userId },
        {
          $push: { likedComments: commentId },
        }
      );
      if (addCommentLike) {
        return res.send(true);
      }
    } else {
      const removeCommentLike = await users.updateOne(
        { _id: userId },
        {
          $pull: { likedComments: commentId },
        }
      );
      if (removeCommentLike) {
        return res.send(false);
      }
    }
    res.end();
  }

  //user comment disliked storage

  if (commentDislike) {
    const userCheck = await users.find({ _id: userId }).exec();
    const commentCheck = userCheck[0]?.dislikedComments?.find((id) => {
      return id == commentId;
    });

    if (commentCheck == undefined) {
      const addCommentDislike = await users.updateOne(
        { _id: userId },
        {
          $push: { dislikedComments: commentId },
        }
      );
      if (addCommentDislike) {
        return res.send(true);
      }
    } else {
      const removeCommentDislike = await users.updateOne(
        { _id: userId },
        {
          $pull: { dislikedComments: commentId },
        }
      );
      if (removeCommentDislike) {
        return res.send(false);
      }
    }
    res.end();
  }

  //removing user comment if comment is deleted

  if (deletedComment) {
    const split = idsToDelete.split(",");
    const final = split.forEach(async (data) => {
      await users.updateMany(
        {},
        {
          $pull: {
            likedComments: data,
            dislikedComments: data,
          },
        }
      );
    });

    return res.send(true);

    res.end();
  }

  //clear post user data if post is deleted

  if (clearPostData) {
    const allUsers = await users.find({}).exec();
    const likedPostCheck = allUsers.map((allusers) =>
      allusers?.likedPosts.find((id) => id == postId)
    );
    const dislikedlikedPostCheck = allUsers.map((allusers) =>
      allusers?.dislikedPosts.find((id) => id == postId)
    );
    const savedPostsCheck = allUsers.map((allusers) =>
      allusers?.savedPosts.find((id) => id == postId)
    );

    if (likedPostCheck || dislikedlikedPostCheck || savedPostsCheck) {
      const removeData = await users.updateMany(
        {},
        {
          $pull: {
            likedPosts: postId,
            dislikedPosts: postId,
            savedPosts: postId,
          },
        }
      );
      if (removeData) {
        return res.send(JSON.stringify("data removed"));
      }
    }
    res.end();
  }

  //NOTIFICATIONS

  if (notification) {
    if (referenceUserId != likerId) {
      if (type == "postLike") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                postUserId: referenceUserId,
                postId: referenceId,
                likerId: likerId,
                action: "liked your post",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(JSON.stringify(type));
        }
        res.end();
      }

      if (type == "postDislike") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                postUserId: referenceUserId,
                postId: referenceId,
                likerId: likerId,
                action: "disliked your post",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(JSON.stringify(type));
        }
        res.end();
      }

      if (type == "newComment") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                commenterId: likerId,
                postId: referenceId,
                action: "commented on your post",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );

        if (addNoti) {
          return res.send(type);
        }
        res.end();
      }

      if (type == "newReply") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                commenterId: likerId,
                postId: referenceId,
                action: "replied to your comment",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(type);
        }
      }

      if (type == "newMessage") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                commenterId: likerId,
                postId: referenceId,
                action: "sent you a message",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(type);
        }
      }

      if (type == "messageLike") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                commenterId: likerId,
                postId: referenceId,
                action: "liked your message",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(type);
        }
      }

      if (type == "messageDislike") {
        const addNoti = await users.updateOne(
          { _id: referenceUserId },
          {
            $push: {
              "notifications": {
                _id: Math.floor(Math.random() * 10000000000),
                username: username,
                commenterId: likerId,
                postId: referenceId,
                action: "disliked your message",
                read: false,
                type: type,
                creationDate: new Date(Date.now()),
              },
            },
          }
        );
        if (addNoti) {
          return res.send(type);
        }
      }
    }
  }

  //add comment like notification

  if (commentLikeNoti) {
    const type = "commentLike";
    const addNoti = await users.updateOne(
      { _id: commentUserId },
      {
        $push: {
          "notifications": {
            _id: Math.floor(Math.random() * 10000000000),
            username: username,
            commentUserId: commentUserId,
            commentId: commentId,
            likerId: likerId,
            postId: postId,
            action: "liked your comment",
            read: false,
            type: type,
            creationDate: new Date(Date.now()),
          },
        },
      }
    );

    if (addNoti) {
      return res.send(type);
    }
    res.end();
  }

  //add comment dislike notifiction

  if (commentDisLikeNoti) {
    const type = "commentDislike";
    const addNoti = await users.updateOne(
      { _id: commentUserId },
      {
        $push: {
          "notifications": {
            _id: Math.floor(Math.random() * 10000000000),
            username: username,
            commentUserId: commentUserId,
            commentId: commentId,
            likerId: likerId,
            postId: postId,
            action: "disliked your comment",
            read: false,
            type: type,
            creationDate: new Date(Date.now()),
          },
        },
      }
    );

    if (addNoti) {
      return res.send(type);
    }
    res.end();
  }

  //update notification read

  if (readChange) {
    const finalRead = await users.updateOne(
      {
        _id: userId,
        "notifications._id": Number(notiId),
      },
      {
        $set: { "notifications.$.read": true },
      }
    );
    if (finalRead) {
      return res.send(true);
    }
    res.end();
  }

  //delete notification

  if (deleteNotification) {
    const user = await users.find({ _id: userId }).exec();
    const notificationFind = user[0].notifications?.find((data) => data);

    const remove = await users.updateOne(
      { _id: userId },
      {
        $pull: { "notifications": { _id: Number(notiId) } },
      }
    );
    if (remove) {
      return res.send(true);
    }
    res.end();
  }

  //FOLLOWERS

  //add and remove following and follower

  if (following) {
    const user = await users.find({ _id: userId }).exec();
    const userCheck = user[0].following.find((user) => user == currentUserId);
    if (userCheck == undefined) {
      const addFollowing = await users.updateOne(
        { _id: userId },
        {
          $push: { "following": currentUserId },
        }
      );
      if (addFollowing) {
        return res.send(JSON.stringify(true));
      }
    } else {
      const removeFollowing = await users.updateOne(
        { _id: userId },
        {
          $pull: { "following": userCheck },
        }
      );
      if (removeFollowing) {
        return res.send(JSON.stringify(false));
      }
    }
  }

  if (follower) {
    const user = await users.find({ _id: userId }).exec();
    const userCheck = user[0].followers.find((user) => user == currentUserId);
    if (userCheck == undefined) {
      const addFollower = await users.updateOne(
        { _id: userId },
        {
          $push: { "followers": currentUserId },
        }
      );
      if (addFollower) {
        return res.send(JSON.stringify(true));
      }
    } else {
      const removeFollower = await users.updateOne(
        { _id: userId },
        {
          $pull: { "followers": userCheck },
        }
      );
      if (removeFollower) {
        return res.send(JSON.stringify(false));
      }
    }
  }

  //pending follow

  if (followRequest) {
    const action = await users.updateOne(
      { _id: receivingUserId },

      {
        $push: { "pendingFollowers": userId },
      }
    );

    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //cancel follow request

  if (cancelFollowRequest) {
    const user = await users.find({ _id: receivingUserId });
    const check = user[0].pendingFollowers.find((el) => el == userId);

    if (check != undefined) {
      const action = await users.updateOne(
        { _id: receivingUserId },
        {
          $pull: { "pendingFollowers": check },
        }
      );

      if (action) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    }
  }

  //confirm follow

  if (confirmFollowRequest) {
    const addToUserFollowers = await users.updateOne(
      { _id: userId },
      {
        $push: { "followers": requestUserId },
      }
    );

    const addToRequestedFollowing = await users.updateOne(
      { _id: requestUserId },
      {
        $push: { "following": userId },
      }
    );

    if (addToUserFollowers && addToRequestedFollowing) {
      const removeFromPending = await users.updateOne(
        { _id: userId },
        {
          $pull: { "pendingFollowers": requestUserId },
        }
      );
      if (removeFromPending) {
        return res.send(true);
      }
    } else {
      return res.send(false);
    }
  }

  //reject follow

  if (rejectFollowRequest) {
    const action = await users.updateOne(
      { _id: userId },
      {
        $pull: { "pendingFollowers": requestUserId },
      }
    );

    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //SETINGS

  //update bio

  if (bioUpdate) {
    const action = await users
      .updateOne(
        { _id: userId },
        {
          bio: updatedBio,
        }
      )
      .exec();

    if (action) {
      return res.send(JSON.stringify(true));
    } else {
      return res.send(JSON.stringify(false));
    }
  }

  //update favorite categories

  if (updateFavoriteCategories) {
    let newIdsArray = updatedFavorites.split(",").flatMap((el) => parseInt(el));
    // const finalIdsArray = newIdsArray.flatMap((el) => parseInt(el));

    const action = await users
      .updateOne(
        { _id: userId },
        {
          favoriteCategories: newIdsArray,
        }
      )
      .exec();

    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  const { versionUpdate, version } = req.query;
  if (versionUpdate) {
    const update = await users.updateOne(
      { _id: userId },
      {
        profileImgVersion: version,
      }
    );
    if (update) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //
});

//users POST

usersRouter.post("/jot-users", async (req, res) => {
  //update profile picture

  const { updateProfilePicture, picUsername, createAccount } = req.query;
  const { pic, username, favoriteCategories, profilePicture, bioContent } =
    req.body;

  if (updateProfilePicture) {
    cloudinary.uploader.upload(
      pic,
      { public_id: picUsername, invalidate: true },
      async (err, result) => {
        if (result) {
          return res.send([true, result.version]);
        } else {
          return res.send(false);
        }
      }
    );
  }

  //create user body

  if (createAccount) {
    if (profilePicture != undefined) {
      cloudinary.uploader.upload(
        profilePicture,
        { public_id: username },
        async function (error, result) {
          if (result) {
            let profileImgUrl = cloudinary.url(username);

            const newUserData = {
              username: username,
              favoriteCategories: favoriteCategories,
              likedPosts: [],
              dislikedPosts: [],
              likedComments: [],
              dislikedComments: [],
              notifications: [],
              followers: [],
              following: [],
              profilePicture: profileImgUrl,
              bio: bioContent,
              profileImgVersion: result.version,
            };

            const newUser = new schemas.JotUsers(newUserData);
            const saveUser = await newUser.save();

            if (saveUser) {
              return res.send(true);
            }
            return;
          }
        }
      );
    } else {
      const newUserData = {
        username: username,
        favoriteCategories: favoriteCategories,
        likedPosts: [],
        dislikedPosts: [],
        likedComments: [],
        dislikedComments: [],
        notifications: [],
        followers: [],
        following: [],
        profilePicture: "",
        bio: bioContent,
        profileImgVersion: "",
      };

      const newUser = new schemas.JotUsers(newUserData);
      const saveUser = await newUser.save();

      if (saveUser) {
        return res.send(true);
      }
    }
  }
});

module.exports = usersRouter;
