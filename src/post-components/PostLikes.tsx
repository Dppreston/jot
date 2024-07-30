import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import { GlobalContext, NotificationData, UserContext } from "../App";
import Login from "../main-components/Login";

const token: string | null = localStorage.getItem("token");

type PostData = {
  userPostData:
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
      }
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
      }[]
    | any;
};

const PostLike = ({ userPostData }: PostData) => {
  const [updatedPostLikes, setUpdatedPostLikes] = useState(userPostData?.likes);
  const [updatedPostDislikes, setUpdatedPostDislikes] = useState(
    userPostData?.dislikes
  );
  const [likeCheck, setLikeCheck] = useState<boolean>(false);
  const [dislikeCheck, setDisLikeCheck] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const likeRef: any = useRef();
  const dislikeRef: any = useRef();
  const { loggedin, setLoginActive, notificationResType } =
    useContext<GlobalContext>(UserContext);

  //like fetch and update

  const fetchLikes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-posts?likes=true&postId=${
          userPostData._id || userPostData[0]!?._id
        }`
      );
      if (loggedin == !false) {
        const likeCheck = await axios.get(
          `http://localhost:1000/jot-posts?likeUserCheck=true&userId=${token}&postId=${
            userPostData._id || userPostData[0]!?._id
          }`
        );

        setLikeCheck(likeCheck.data);
      }

      setTimeout(() => {
        setUpdatedPostLikes(res.data[0].likes!);
      }, 300);
    } catch (err) {
      console.log(err);
    }
  };

  //disliked fetch and update

  const fetchDislikes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-posts?dislikes=true&postId=${
          userPostData._id || userPostData[0]!?._id
        }`
      );

      if (loggedin == !false) {
        const dislikeCheck = await axios.get(
          `http://localhost:1000/jot-posts?dislikeUserCheck=true&userId=${token}&postId=${
            userPostData._id || userPostData[0]!?._id
          }`
        );
        setDisLikeCheck(dislikeCheck.data);
      }

      setTimeout(() => {
        setUpdatedPostDislikes(res.data[0].dislikes!);
      }, 300);
    } catch (err) {
      console.log(err);
    }
  };

  //like functionality

  const likeFunctionality = async () => {
    try {
      //add or remove post like
      const res = await axios.put(
        `http://localhost:1000/jot-posts?postLike=true&postId=${
          userPostData._id || userPostData[0]._id
        }&userId=${token}`
      );

      if (res.data == true) {
        //liker username

        const likerUsername = await axios.get(
          `http://localhost:1000/jot-users?likerUsername=true&userId=${token}`
        );

        //add post like notification
        if (
          res.data == true &&
          (userPostData.userId || userPostData[0].userId) !== token
        ) {
          //data for notification

          let notificationData: NotificationData = {
            referenceId: userPostData._id || userPostData[0]._id,
            username: likerUsername.data[0].username,
            referenceUserId: userPostData.userId || userPostData[0].userId,
            actionUserId: token!,
            type: "postLike",
          };

          window.handleNotification(notificationData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //dislike functionality

  const dislikeFunctionality = async () => {
    try {
      const res = await axios.put(
        `http://localhost:1000/jot-posts?postDislike=true&postId=${
          userPostData._id || userPostData[0]._id
        }&userId=${token}`
      );

      if (res.data == true) {
        //disliker username

        const likerUsername = await axios.get(
          `http://localhost:1000/jot-users?likerUsername=true&userId=${token}`
        );

        //add post dislike noti

        if (
          res.data == true &&
          (userPostData.userId || userPostData[0].userId) !== token
        ) {
          let notificationData: NotificationData = {
            referenceId: userPostData._id || userPostData[0]._id,
            username: likerUsername.data[0].username,
            referenceUserId: userPostData.userId || userPostData[0].userId,
            actionUserId: token!,
            type: "postDislike",
          };

          window.handleNotification(notificationData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //user like memory

  const userLikeMemory = async () => {
    try {
      await axios.put(
        `http://localhost:1000/jot-users?userLike=true&postId=${
          userPostData._id || userPostData[0]._id
        }&userId=${token}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  //user dislike memory

  const userDislikeMemory = async () => {
    try {
      await axios.put(
        `http://localhost:1000/jot-users?userDislike=true&postId=${
          userPostData._id || userPostData[0]._id
        }&userId=${token}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchDislikes();
  }, [userPostData]);

  return (
    <>
      <div className="post__like--container">
        <span>
          <i
            className={
              likeCheck == true
                ? "fa-solid fa-thumbs-up"
                : "fa-regular fa-thumbs-up"
            }
            onClick={(e) => {
              if (e.target && loggedin == !false) {
                userLikeMemory();
                likeFunctionality();
                setTimeout(() => {
                  fetchLikes();
                }, 200);
              } else {
                setLoginActive(!false);
              }
            }}
            ref={likeRef}
          ></i>
          <p className="like__style" id="like__counter">
            {updatedPostLikes}
          </p>
        </span>{" "}
        | {""}
        <span>
          <i
            className={
              dislikeCheck == true
                ? "fa-solid fa-thumbs-down"
                : "fa-regular fa-thumbs-down"
            }
            onClick={(e) => {
              if (e.target && loggedin == !false) {
                userDislikeMemory();
                dislikeFunctionality();
                setTimeout(() => {
                  fetchDislikes();
                }, 200);
              } else {
                setLoginActive(!false);
              }
            }}
            ref={dislikeRef}
          ></i>
          <p className="like__style" id="dislike__counter">
            {updatedPostDislikes}
          </p>
        </span>
      </div>
    </>
  );
};
export default PostLike;
