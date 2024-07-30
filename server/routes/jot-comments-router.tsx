express = require("express");
schemas = require("../schemas/schemas.ts");
const commentsRouter = express.Router();

//comments POST

commentsRouter.post("/jot-comments", async (req, res) => {
  //create comment body

  const { newComment, commentReply } = req.query;
  const { userId, postId, commentBody, commentId, commentParentId } = req.body;

  if (newComment) {
    const commentData = {
      userId: userId,
      postId: postId,
      reply: false,
      commentBody: commentBody,
      commentLikes: 0,
      commentDislikes: 0,
      likedUser: [],
      dislikedUsers: [],
      replyCommentId: "",
      commentParentId: "",
    };
    const newComment = new schemas.JotComments(commentData);
    const saveComment = await newComment.save();
    if (saveComment) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //comment reply

  if (commentReply) {
    const replyData = {
      userId: userId,
      postId: postId,
      reply: true,
      replyCommentId: commentId,
      commentBody: commentBody,
      commentLikes: 0,
      commentDislikes: 0,
      likedUser: [],
      dislikedUsers: [],
      commentParentId: commentParentId,
    };

    const newComment = new schemas.JotComments(replyData);
    const saveComment = await newComment.save();
    if (saveComment) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }
});

//comments GET

commentsRouter.get("/jot-comments", async (req, res) => {
  const comments = schemas.JotComments;

  //queries

  const {
    fetchComments,
    postId,
    sortSelection,
    commentDislikeCheck,
    commentLikeCheck,
    commentId,
    userId,
    sortComments,
    commentCount,
    fetchReplies,
    parentCommentId,
    commentParentId,
    loadMoreComments,
    dynamicLength,
  } = req.query;

  //fetch and filter comments

  if (fetchComments) {
    const allCommentData = await comments.find({ postId: postId }).exec();
    const commentData = await comments
      .find({ postId: postId })
      .limit(10)
      .exec();
    if (commentData) {
      return res.send([commentData, commentData.length, allCommentData.length]);
    }
    res.end();
  }

  //load more comments

  if (loadMoreComments) {
    if (sortSelection == "Top") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ commentLikes: -1 })
        .limit(Number(dynamicLength) + 1)
        .exec();
      if (commentData) {
        return res.send([commentData, commentData.length]);
      }
    }
    if (sortSelection == "Old") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ creationDate: 1 })
        .limit(Number(dynamicLength) + 1)
        .exec();
      if (commentData) {
        return res.send([commentData, commentData.length]);
      }
    }
    if (sortSelection == "New") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ creationDate: -1 })
        .limit(Number(dynamicLength) + 1)
        .exec();
      if (commentData) {
        return res.send([commentData, commentData.length]);
      }
    }
    if (sortSelection == "Low") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ commentDislikes: -1 })
        .limit(Number(dynamicLength) + 1)
        .exec();
      if (commentData) {
        return res.send([commentData, commentData.length]);
      }
    }
  }

  //comment sort

  if (sortComments) {
    if (sortSelection == "Top") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ commentLikes: -1 })
        .limit(10)
        .exec();
      if (commentData) {
        return res.send(JSON.stringify(commentData));
      } else {
        return res.send(false);
      }
    }

    if (sortSelection == "Old") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ creationDate: 1 })
        .limit(10)
        .exec();
      if (commentData) {
        return res.send(JSON.stringify(commentData));
      } else {
        return res.send(false);
      }
    }

    if (sortSelection == "New") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ creationDate: -1 })
        .limit(10)
        .exec();
      if (commentData) {
        return res.send(JSON.stringify(commentData));
      } else {
        return res.send(false);
      }
    }

    if (sortSelection == "Low") {
      const commentData = await comments
        .find({ postId: postId })
        .sort({ commentDislikes: -1 })
        .limit(10)
        .exec();
      if (commentData) {
        return res.send(JSON.stringify(commentData));
      } else {
        return res.send(false);
      }
    }
    res.end();
  }

  //comment like check

  if (commentLikeCheck) {
    const commentData = await comments.find({ _id: commentId }).exec();
    const result = commentData[0].likedUsers.find((id) => id == userId);

    if (result != undefined) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //comment dislike check

  if (commentDislikeCheck) {
    const commentData = await comments.find({ _id: commentId }).exec();
    const result = commentData[0].dislikedUsers.find((id) => id == userId);

    if (result != undefined) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //comment count for MAIN FEED

  if (commentCount) {
    const commentCount = await comments.find({ postId: postId }).exec();
    if (commentCount) {
      return res.send(JSON.stringify(commentCount.length));
    }
    res.end();
  }

  if (fetchReplies) {
    const postData = await comments
      .find({ replyCommentId: parentCommentId })
      .exec();
    if (postData) {
      return res.send(JSON.stringify(postData));
    } else {
      return res.send(JSON.stringify(false));
    }
  }

  if (commentParentId) {
    const commentData = await comments
      .find({ _id: commentId }, { commentParentId: 1 })
      .exec();
    if (commentData == undefined) {
      return res.send(JSON.stringify(commentId));
    } else {
      return res.send(JSON.stringify(commentData));
    }
  }

  //find all ids to delete

  const { idsToDelete } = req.query;
  if (idsToDelete) {
    const allCommentsToDelete = new Array();

    const commentToDelete = await comments.find({ _id: commentId }).exec();

    const repliesToDelete = await comments
      .find({ commentParentId: commentId })
      .exec();

    if (repliesToDelete && commentToDelete) {
      allCommentsToDelete.push(...commentToDelete);
      allCommentsToDelete.push(...repliesToDelete);
    }
    if (allCommentsToDelete.length > 0) {
      return res.send(JSON.stringify(allCommentsToDelete));
    }
  }

  const { deletePostIdsToDelete } = req.query;
  if (deletePostIdsToDelete) {
    const data = await comments.find({ postId: postId }).exec();
    if (data) {
      return res.send(JSON.stringify(data));
    }
  }

  const { userTopComments } = req.query;
  if (userTopComments) {
    const commentData = await comments
      .find({ userId: userId })
      .sort({ commentLikes: -1 })
      .limit(3)
      .exec();
    if (commentData) {
      return res.send(JSON.stringify(commentData));
    }
  }

  //report data

  const { reportData } = req.query;

  if (reportData) {
    const data = await comments.find({ _id: commentId }).exec();
    if (data) {
      return res.send(JSON.stringify(data));
    } else {
      return res.send(false);
    }
  }
});

//comments PUT

commentsRouter.put(`/jot-comments`, async (req, res) => {
  const comments = schemas.JotComments;

  const { commentLikes, commentId, userLikedRes } = req.query;

  //add, remove and check comment likes

  if (commentLikes) {
    if (userLikedRes == "true") {
      const addLike = await comments.updateOne(
        { _id: commentId },
        {
          $inc: { commentLikes: 1 },
        }
      );
      if (addLike) {
        return res.send(true);
      }
    } else {
      const removeLike = await comments.updateOne(
        { _id: commentId },
        {
          $inc: { commentLikes: -1 },
        }
      );
      if (removeLike) {
        return res.send(false);
      }
    }
    res.end();
  }

  //remove, add and check comment dislikes
  const { commentDislikes, userDislikedRes } = req.query;

  if (commentDislikes) {
    if (userDislikedRes == "true") {
      const addLike = await comments.updateOne(
        { _id: commentId },
        {
          $inc: { commentDislikes: 1 },
        }
      );
      if (addLike) {
        return res.send(true);
      }
    } else {
      const removeLike = await comments.updateOne(
        { _id: commentId },
        {
          $inc: { commentDislikes: -1 },
        }
      );
      if (removeLike) {
        return res.send(false);
      }
    }
    res.end();
  }

  //add / remove liked users

  const { addUserLikeToComment, userId, matched } = req.query;

  //add user id to comment like

  if (addUserLikeToComment) {
    const updateUserLike = await comments.updateOne(
      { _id: commentId },
      {
        $push: {
          likedUsers: userId,
        },
      }
    );

    if (updateUserLike) {
      return res.send(true);
    }
    res.end();
  }

  //remove user id from comment like

  const { removeUserLikeFromComment } = req.query;

  if (removeUserLikeFromComment) {
    const updateUserLike = await comments
      .updateOne({ _id: commentId }, { $pull: { likedUsers: matched } })
      .exec();
    if (updateUserLike) {
      return res.send(true);
    }
    res.end();
  }

  //add user id to comment like
  const { addUserDisLikeToComment, removeUserDisLikeFromComment } = req.query;

  if (addUserDisLikeToComment) {
    const updateUserLike = await comments.updateOne(
      { _id: commentId },
      {
        $push: {
          dislikedUsers: userId,
        },
      }
    );

    if (updateUserLike) {
      return res.send(true);
    }
    res.end();
  }

  //remove user id from comment like

  if (removeUserDisLikeFromComment) {
    const updateUserLike = await comments
      .updateOne({ _id: commentId }, { $pull: { dislikedUsers: matched } })
      .exec();
    if (updateUserLike) {
      return res.send(true);
    }
    res.end();
  }

  //delete comment

  const { commentDelete } = req.query;

  if (commentDelete) {
    const deleteOne = await comments.deleteOne({ _id: commentId }).exec();
    if (deleteOne) {
      const deleteMany = await comments
        .deleteMany({ commentParentId: commentId })
        .exec();
      if (deleteMany) {
        return res.send(true);
      }
    }
    res.end();
  }

  //delete comments from deleted post

  const { removeCommentsFromDeletedPosts, postId } = req.query;

  if (removeCommentsFromDeletedPosts) {
    const data = await comments.deleteMany({ postId: postId }).exec();
    if (data) {
      return res.send(JSON.stringify(data));
    }
  }
});

module.exports = commentsRouter;
