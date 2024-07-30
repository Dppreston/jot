import axios from "axios";
import { useState, useEffect, useContext } from "react";
import logo from "../assets/jot-logo.png";
import Button from "../buttons/ButtonMain";
import { GlobalContext, NotificationData, UserContext } from "../App";
import smallLoader from "../assets/small--loader.gif";

const token: string | null = localStorage.getItem("token");

const sortOptions: { id: number; selection: string }[] = [
  {
    id: 1,
    selection: "Top",
  },
  {
    id: 2,
    selection: "New",
  },
  {
    id: 3,
    selection: "Old",
  },
  {
    id: 4,
    selection: "Low",
  },
];

const commentOptions: {
  id: number;
  title: string;
  icon: string;
  liked?: string;
}[] = [
  {
    id: 1,
    title: "Like",
    icon: "fa-regular fa-thumbs-up",
    liked: "fa-solid fa-thumbs-up",
  },
  {
    id: 2,
    title: "Dislike",
    icon: "fa-regular fa-thumbs-down",
    liked: "fa-solid fa-thumbs-down",
  },
  {
    id: 3,
    title: "Reply",
    icon: "fa-solid fa-turn-down",
  },
  {
    id: 4,
    title: "Menu",
    icon: "fa-solid fa-ellipsis",
  },
  {
    id: 5,
    title: "Delete",
    icon: "fa-solid fa-trash",
  },
  {
    id: 6,
    title: "Report",
    icon: "fa-regular fa-flag",
  },
];

type CommentDataProps = {
  commentData: {
    _id: string;
    userId: string;
    postId: string;
    commentBody: string;
    commentLikes: number;
    commentDislikes: number;
    creationDate: string;
    likedUsers: string[];
    dislikedUsers: string[];
    reply: boolean;
    commentParentId: string;
    replyCommentId: string;
  };
  handleClicked: (clicked: boolean) => void;
  postId: string | undefined;
  replyData?: {
    _id: string;
    userId: string;
    postId: string;
    commentBody: string;
    commentLikes: number;
    commentDislikes: number;
    creationDate: string;
    likedUsers: string[];
    dislikedUsers: string[];
    reply: boolean;
    commentParentId: string;
    replyCommentId: string;
  }[];
};

type UserData = {
  username: string;
  profilePicture?: string;
  profileImgVersion?: number;
};

type PostData = {
  postData:
    | {
        _id?: string;
        category?: string;
        creationDate?: string;
        headline?: string;
        postBody?: string;
        title?: string;
        userId?: string;
        likes?: number;
        dislikes?: number;
        commentCount?: number;
      }[]
    | undefined;
};

type CommentData = {
  _id: string;
  userId: string;
  postId: string;
  commentBody: string;
  commentLikes: number;
  commentDislikes: number;
  creationDate: string;
  likedUsers: string[];
  dislikedUsers: string[];
  reply: boolean;
  commentParentId: string;
  replyCommentId: string;
};

type CommentDropdownProps = {
  dropdownSelection: (selection: boolean) => void;
  userId: string;
  commentData: CommentData;
  postId: string | undefined;
  reply?: boolean;
  deleteComment: Function;
  removeLikeData: Function;
};

type ReplyProps = {
  commentId: string;
  postId: string | undefined;
  setReplyActive: Function;
  receiverId: string | undefined;
};

export const CommentDropdown = ({
  dropdownSelection,
  userId,
  deleteComment,
  removeLikeData,
  commentData,
}: CommentDropdownProps) => {
  const {
    setConfirmConditions,
    setConfirmActive,
    setReportActive,
    setReportConditions,
  } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div className="comment__dropdown">
        <button
          className="comment__dropdown--selection"
          onClick={() => {
            dropdownSelection(!false);
            setReportActive(!false);
            setReportConditions({
              reportType: "comment",
              reportReferenceId: commentData._id,
            });
          }}
        >
          <i className={commentOptions[5].icon}></i>
          {commentOptions[5].title}
        </button>
        {userId == token ? (
          <button
            className="comment__dropdown--selection"
            onClick={() => {
              dropdownSelection(!false);
              setConfirmActive(!false);
              setConfirmConditions({
                content: "Are you sure you want to delete this comment?",
                confirmAction: deleteComment,
                secondAction: removeLikeData,
              });
            }}
          >
            <i className={commentOptions[4].icon}></i>
            {commentOptions[4].title}
          </button>
        ) : null}
      </div>
    </>
  );
};

export const CommentReply = ({
  commentId,
  postId,
  setReplyActive,
  receiverId,
}: ReplyProps) => {
  const [replyData, setReplyData] = useState<string | null>("");
  const [parentId, setParentId] = useState<string>("");
  const [inactive, setInactive] = useState<boolean>(false);
  //fetch parent Id

  const fetchParentId = async () => {
    const res = await axios.get(
      `/jot-comments?commentParentId=true&commentId=${commentId}`
    );
    if (res.data[0].commentParentId == "") {
      setParentId(commentId);
    } else {
      setParentId(res.data[0].commentParentId);
    }
  };

  //reply post data

  const replyPostData = {
    userId: token,
    postId: postId,
    commentId: commentId,
    commentBody: replyData,
    commentParentId: parentId,
  };

  // add comment reply
  const addReply = async () => {
    const res = await axios.post(
      `/jot-comments?commentReply=true`,
      replyPostData
    );

    if (res.data) {
      //reply notification add // remove

      const usernameForCommentNoti = await axios.get(
        `/jot-users?likerUsername=true&userId=${token}`
      );

      // //add new reply notification

      let notificationData: NotificationData = {
        actionUserId: token!,
        username: usernameForCommentNoti.data[0].username,
        referenceId: postId!,
        referenceUserId: receiverId!,
        type: "newReply",
      };

      window.handleNotification(notificationData);

      window.notificationCheck();
      setReplyActive(false);
      window.fetchComments();
    }
  };

  //reply conditions

  const conditions = () => {
    if (replyData != "") {
      setInactive(!false);
    } else {
      setInactive(false);
    }
  };

  useEffect(() => {
    fetchParentId();
  }, []);

  return (
    <>
      <div className="comment__reply--input--container">
        <textarea
          name="comment--reply"
          id="comment__reply"
          onChange={(e) => setReplyData(e.currentTarget.value)}
          onBlur={() => conditions()}
          placeholder="Have something to say?"
        ></textarea>
        <div className="reply__submit--container">
          <Button content={"Sumbit"} action={addReply} inactive={inactive} />
        </div>
      </div>
    </>
  );
};

export const CommentTile = ({
  commentData,
  handleClicked,
  postId,
}: CommentDataProps) => {
  const [userData, setUserData] = useState<UserData[]>();
  const [likedRes, setLikeRes] = useState<boolean>(false);
  const [dislikedRes, setDislikedRes] = useState<boolean>(false);
  const [userId] = useState<string>(commentData.userId);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [, setDropdownSelectionProps] = useState<boolean>(false);

  const [replyActive, setReplyActive] = useState<boolean>(false);
  const [replyData, setReplyData] = useState<any>();
  const [memberSince, setMemberSince] = useState<string>("");
  const { darkActive, loggedin, setLoginActive, setConfirmActive } =
    useContext<GlobalContext>(UserContext);

  //date joined

  const dateJoined = () => {
    const creationDate = new Date(
      commentData.creationDate
    ).toLocaleDateString();

    setMemberSince(creationDate);
  };

  //fetch comment username

  const fetchCommentUsername = async () => {
    try {
      const res = await axios.get(
        `/jot-users?fetchCommentUsername=true&commentUser=${commentData.userId}`
      );
      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //handling comment like

  const updateCommentUserLike = async () => {
    try {
      const userCommentRes = await axios.put(
        `/jot-users?commentLike=true&commentId=${commentData._id}&userId=${token}`
      );

      if (userCommentRes) {
        const likeRes = await axios.put(
          `/jot-comments?commentLikes=true&commentId=${commentData._id}&userLikedRes=${userCommentRes.data}`
        );

        //add/remove user to comment

        const matchedIds = commentData.likedUsers.find((id) => id == token);

        if (matchedIds == undefined) {
          //add user to comment
          await axios.put(
            `/jot-comments?addUserLikeToComment=true&commentId=${commentData._id}&userId=${token}`
          );
        } else {
          //remove user from comment
          await axios.put(
            `/jot-comments?removeUserLikeFromComment=true&commentId=${commentData._id}&matched=${matchedIds}`
          );
        }

        interactionCheck();

        //comment notification add // remove

        const usernameForCommentNoti = await axios.get(
          `/jot-users?likerUsername=true&userId=${token}`
        );

        if (likeRes.data == true && commentData.userId !== token) {
          //add comment like noti
          await axios.put(
            `/jot-users?commentLikeNoti=true&commentUserId=${commentData.userId}&username=${usernameForCommentNoti.data[0].username}&likerId=${token}&commentId=${commentData._id}&postId=${postId}`
          );
        }
      }
      window.notificationCheck();
    } catch (err) {
      console.log(err);
    }
  };

  //handling comment dislike

  const updateCommentUserDislike = async () => {
    try {
      const userCommentRes = await axios.put(
        `/jot-users?commentDislike=true&commentId=${commentData._id}&userId=${token}`
      );

      if (userCommentRes) {
        const dislikedRes = await axios.put(
          `/jot-comments?commentDislikes=true&commentId=${commentData._id}&userDislikedRes=${userCommentRes.data}`
        );

        const matchedIds = commentData.dislikedUsers.find((id) => id == token);

        if (matchedIds == undefined) {
          //add user to comment
          await axios.put(
            `/jot-comments?addUserDisLikeToComment=true&commentId=${commentData._id}&userId=${token}`
          );
        } else {
          //remove user from comment
          await axios.put(
            `/jot-comments?removeUserDisLikeFromComment=true&commentId=${commentData._id}&matched=${matchedIds}`
          );
        }
        interactionCheck();

        //comment notification add // remove

        const usernameForCommentNoti = await axios.get(
          `/jot-users?likerUsername=true&userId=${token}`
        );

        if (dislikedRes.data == true && commentData.userId !== token) {
          //add comment noti
          await axios.put(
            `/jot-users?commentDisLikeNoti=true&commentUserId=${commentData.userId}&username=${usernameForCommentNoti.data[0].username}&likerId=${token}&commentId=${commentData._id}&postId=${postId}`
          );
        }

        window.notificationCheck();
      }
    } catch (err) {
      console.log(err);
    }
  };

  //comment interaction check

  const interactionCheck = async () => {
    try {
      const likeRes = await axios.get(
        `/jot-comments?commentLikeCheck=true&userId=${token}&commentId=${commentData._id}`
      );
      const dislikeRes = await axios.get(
        `/jot-comments?commentDislikeCheck=true&userId=${token}&commentId=${commentData._id}`
      );
      if (likeRes.data == true) {
        setLikeRes(likeRes.data);
      } else {
        setLikeRes(likeRes.data);
      }
      if (dislikeRes.data == true) {
        setDislikedRes(dislikeRes.data);
      } else {
        setDislikedRes(dislikeRes.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //dropdown selection

  const dropdownSelection = (selection: boolean) => {
    setDropdownSelectionProps(selection);
  };

  //reply fetch

  const fetchReplies = async () => {
    const replyRes = await axios.get(
      `/jot-comments?fetchReplies=true&parentCommentId=${commentData._id}`
    );

    setReplyData(replyRes.data);
  };

  //delete comment

  const deleteComment = async () => {
    try {
      const res = await axios.put(
        `/jot-comments?commentDelete=true&commentId=${
          commentData ? commentData._id : null
        }`
      );
      if (res.data == !false) {
        setDropdownSelectionProps(false);
        setConfirmActive(false);
        window.fetchComments();
      }

      await axios.put(`/jot-posts?updateCommentCount=true&postId=${postId}`);
    } catch (err) {
      console.log(err);
    }
  };

  //remove post like/dilsike from user

  const removeLikeDataFromUser = async () => {
    try {
      const test = await axios.get(
        `/jot-comments?idsToDelete=true&commentId=${commentData._id}`
      );
      const filteredIds = test.data.map((el: { _id: string }) => el._id);

      if (test.data) {
        await axios.put(
          `/jot-users?deletedComment=true&userId=${token}&idsToDelete=${filteredIds}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (commentData != undefined) {
      fetchReplies();
      fetchCommentUsername();
      interactionCheck();
      dateJoined();
    }
  }, [commentData]);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [[], replyActive, sortOptions, dropdown]);

  return (
    <>
      <div className="comment__tile" key={commentData._id}>
        <div className="comment__top">
          <div className="comment__img--container">
            <img
              src={
                userData! != undefined && userData![0]?.profilePicture != ""
                  ? `${userData![0]?.profilePicture}.js?=version${
                      userData![0]?.profileImgVersion
                    }`
                  : logo
              }
              id="nav__profile--picture"
              style={
                userData! != undefined && userData![0]?.profilePicture != ""
                  ? { width: "inherit", height: "inherit" }
                  : { width: "75%", height: "auto" }
              }
            />
          </div>
          <button
            id="comment__username"
            onClick={() =>
              (window.location.href = `${window.location.origin}/user/${
                userData![0]?.username
              }/${userId}`)
            }
          >
            <p>{userData ? userData[0].username : undefined}</p>
          </button>
          <i className="fa-solid fa-circle circle__spacer"></i>
          <p id="comment__date">{memberSince}</p>
        </div>
        <div className="comment__bottom">
          <div className="comment__bottom--left">
            <div className="comment__spacer"></div>
          </div>
          <div className="comment__bottom--right">
            <p className="comment__body">{commentData.commentBody}</p>
            <div className="comment__interaction--container">
              <div className="comment__like--container">
                <i
                  className={
                    likedRes == true
                      ? commentOptions[0].liked
                      : commentOptions[0].icon
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (loggedin == !false) {
                      updateCommentUserLike();
                      handleClicked(true);
                    } else {
                      setLoginActive(!false);
                    }
                  }}
                ></i>
                <p className="" id="comment__like--counter">
                  {commentData ? commentData.commentLikes : 0}
                </p>
                |
                <i
                  className={
                    dislikedRes == true
                      ? commentOptions[1].liked
                      : commentOptions[1].icon
                  }
                  onClick={() => {
                    if (loggedin == !false) {
                      updateCommentUserDislike();
                      handleClicked(true);
                    } else {
                      setLoginActive(!false);
                    }
                  }}
                ></i>
                <p className="" id="comment__like--counter">
                  {commentData ? commentData.commentDislikes : 0}
                </p>
              </div>
              {loggedin == !false ? (
                <button
                  id="comment__reply--button"
                  onClick={(e) => {
                    setReplyActive(!false);
                    if (e && replyActive == !false) {
                      setReplyActive(false);
                    }
                  }}
                  style={
                    replyActive == !false
                      ? {
                          background: "var(--hover-on-white)",
                          border: "var(--border)",
                          borderRadius: "4px",
                        }
                      : undefined
                  }
                >
                  <i className={commentOptions[2].icon}></i>
                </button>
              ) : null}

              <div className="comment__dropdown--container">
                <i
                  className={commentOptions[3].icon}
                  onClick={(e) => {
                    setDropdown(!false);

                    if (dropdown == !false && e) {
                      setDropdown(false);
                    }
                  }}
                ></i>
                {dropdown == !false ? (
                  <CommentDropdown
                    dropdownSelection={dropdownSelection}
                    userId={userId}
                    commentData={commentData}
                    postId={postId}
                    deleteComment={deleteComment}
                    removeLikeData={removeLikeDataFromUser}
                  />
                ) : null}
              </div>
            </div>

            <div className="comment__reply--container">
              {replyActive == !false ? (
                <CommentReply
                  commentId={commentData._id}
                  postId={postId}
                  setReplyActive={setReplyActive}
                  receiverId={commentData.userId}
                />
              ) : null}
              {replyData != undefined
                ? replyData!
                    ?.filter((el: any) => el.reply === true)
                    .map((data: any, key: any) => (
                      <CommentTile
                        commentData={data}
                        key={key}
                        handleClicked={handleClicked}
                        postId={postId}
                      />
                    ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SortDopdown = ({ sortSelection }: any) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  return (
    <>
      <div
        className="sort__dropdown--menu"
        style={
          darkActive == !false
            ? {
                background: "var(--hover-on-black-DM",
                color: "var(--hover-on-grey)",
              }
            : undefined
        }
      >
        {sortOptions?.map((options) => (
          <button
            className="comment__sort--selection"
            key={options.id}
            onClick={() => {
              sortSelection(options.selection);
            }}
            style={
              darkActive == !false
                ? {
                    color: "var(--hover-on-grey)",
                  }
                : undefined
            }
          >
            {options.selection}
          </button>
        ))}
      </div>
    </>
  );
};

export const CommentSort = ({ sortProp }: any) => {
  const [selection, setSelection] = useState<string | undefined>(
    sortOptions[0].selection
  );
  const [dropdown, setDropdown] = useState<boolean>(false);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //selection Check

  const sortSelection = (selection: string | undefined) => {
    if (selection) {
      setSelection(selection);
      sortProp(selection);
    }
  };

  useEffect(() => {
    setDropdown(false);
  }, [selection]);

  return (
    <>
      <div className="comment__sorting--container">
        <div
          className="sort__dropdown--btn"
          onClick={(e) => {
            if (dropdown == false) {
              setDropdown(!false);
            }
            if (dropdown == !false || !e.target) {
              setDropdown(false);
            }
          }}
          style={
            darkActive == !false
              ? {
                  color: "var(--hover-on-grey)",
                }
              : undefined
          }
        >
          <h4>{selection}</h4>
          <i
            className="fa-solid fa-chevron-down"
            style={
              darkActive == !false
                ? {
                    color: "var(--hover-on-grey)",
                  }
                : undefined
            }
          ></i>
          {dropdown == !false ? (
            <SortDopdown sortSelection={sortSelection} />
          ) : null}
        </div>
      </div>
    </>
  );
};

const Comments = ({ postData }: PostData) => {
  const [commentBody, setCommentBody] = useState<string>("");
  const [commentRes, setCommentRes] = useState<boolean | undefined>();
  const [commentData, setCommentData] = useState<CommentData[]>();
  const [sortSelection, setSortSelection] = useState<string>("Top");
  const [commentCount, setCommentCount] = useState<number | undefined>(
    postData![0].commentCount
  );
  const [dynamicLength, setDynamicLength] = useState<number>();
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { loggedin, setLoginActive } = useContext<GlobalContext>(UserContext);
  const [inactive, setInactive] = useState<boolean>(false);

  //global fetch comments

  window.fetchComments = async function () {
    try {
      const res = await axios.get(
        `/jot-comments?fetchComments=true&postId=${postData![0]._id}`
      );

      setDynamicLength(res.data[1]);
      setCommentData(res.data[0]);
      setCommentCount(res.data[2]);

      if (res.data[1] != res.data[2]) {
        setLoadMore(!false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreComments = async () => {
    setLoading(!false);
    const res = await axios.get(
      `/jot-comments?loadMoreComments=true&postId=${
        postData![0]._id
      }&dynamicLength=${dynamicLength}&sortSelection=${sortSelection}`
    );
    setTimeout(() => {
      setLoading(false);
      setCommentData(res.data[0]);
      setDynamicLength(res.data[1]);

      if (res.data[1] == commentCount) {
        setLoadMore(false);
      } else {
        setLoadMore(!false);
      }
    }, 1000);
  };

  const sortComments = async () => {
    try {
      const res = await axios.get(
        `/jot-comments?sortComments=true&sortSelection=${sortSelection}&postId=${
          postData![0]._id
        }`
      );
      setCommentData(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    sortComments();
  }, [sortSelection]);

  //new comment

  const newCommentPost = async () => {
    const commentData = {
      userId: token,
      postId: postData![0]._id,
      commentBody: commentBody,
    };
    try {
      const res = await axios.post(
        `/jot-comments?newComment=true`,
        commentData
      );
      postCommentCount();
      setCommentRes(res.data);
      setCommentBody("");
      setTimeout(() => {
        setCommentRes(undefined);
        setCommentCount(commentCount! + 1);
      }, 500);

      if (res.data == true) {
        window.fetchComments();

        //comment notification add // remove

        const usernameForCommentNoti = await axios.get(
          `/jot-users?likerUsername=true&userId=${token}`
        );

        //add new comment notification

        let notificationData: NotificationData = {
          referenceId: postData![0]._id!,
          referenceUserId: postData![0].userId!,
          username: usernameForCommentNoti.data[0].username,
          actionUserId: token!,
          type: "newComment",
        };

        window.handleNotification(notificationData);

        window.notificationCheck();
        setInactive(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //comment count post

  const postCommentCount = async () => {
    try {
      await axios.put(`/jot-posts?addComment=true&postId=${postData![0]._id}`);
    } catch (err) {}
  };

  const handleClicked = (clicked: boolean) => {
    if (clicked) {
      setTimeout(() => {
        window.fetchComments();
      }, 500);
    }
  };

  const sortProp = (sortState: string) => {
    setSortSelection(sortState);
  };

  //comment conditions

  const conditions = () => {
    if (commentBody != "") {
      setInactive(!false);
    } else {
      setInactive(false);
    }
  };
  //handle comment like/disliked check

  useEffect(() => {
    window.fetchComments();
  }, [postData]);

  useEffect(() => {
    window.loginCheck(token);
  }, []);

  return (
    <>
      <div className="comments__wrapper">
        <div className="comments__upper">
          <div className="comment__count--wrapper">
            <h3>Comments</h3>
            <span className="comment__count">
              <h4>{commentCount}</h4>
            </span>
          </div>
          <div
            className="comment__input--wrapper"
            style={
              loggedin == false
                ? { opacity: ".5", pointerEvents: "none" }
                : undefined
            }
          >
            <textarea
              name="comments"
              id="comment__input"
              placeholder="Have something to say?"
              onChange={(e) => {
                setCommentBody(e.currentTarget.value);
              }}
              onClick={() => {
                loggedin == false ? setLoginActive(!false) : null;
              }}
              onBlur={() => conditions()}
              value={commentBody}
            ></textarea>
            <div className="create__comment--wrapper">
              {commentRes == true ? (
                <p className="comment__success">Comment added</p>
              ) : null}
              {commentRes == false ? (
                <p className="comment__fail">
                  Something went wrong. Please try again.
                </p>
              ) : null}
              <Button
                content={"Submit"}
                action={newCommentPost}
                inactive={inactive}
              />
            </div>
            {loggedin == false ? (
              <div className="logged__out--comment--alert">
                <img src={logo} style={{ width: "25px", height: "25px" }} />
                <h4>Login to Comment</h4>
              </div>
            ) : null}
          </div>
        </div>
        <div className="comments__lower">
          <CommentSort sortProp={sortProp} />
          {commentData!?.length > 0 ? (
            commentData
              ?.filter((el) => el.reply === false)
              .map((data) => (
                <CommentTile
                  commentData={data}
                  key={data._id}
                  handleClicked={handleClicked}
                  postId={postData![0]._id}
                />
              ))
          ) : (
            <div className="first__comment--alert">
              <img src={logo} alt="jot-logo" id="no__comment--img" />
              <p>Be the first to leave a comment!</p>
            </div>
          )}
        </div>
        {loadMore == !false ? (
          <button
            className="load__more--comments--button"
            onClick={(e) => {
              e.preventDefault();
              loadMoreComments();
            }}
          >
            {loading == false ? (
              <h3>Load More</h3>
            ) : (
              <img
                src={smallLoader}
                style={{ width: "25px", height: "25px" }}
              />
            )}
          </button>
        ) : null}
      </div>
    </>
  );
};
export default Comments;
