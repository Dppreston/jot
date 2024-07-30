import axios from "axios";
import { useContext, useEffect, useState } from "react";
import PostLike from "./PostLikes";
import PostInteractions from "./PostInteractions";
import PostImg from "./PostImg";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import categories from "../staticdata/Categories";
import { GlobalContext, UserContext } from "../App";

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
        postImg?: string;
        postImgVersion?: number;
      }
    | undefined;
};

type PostUserData = {
  _id: string;
  username: string;
  password: string;
  lastName: string;
  firstName: string;
  email: string;
  creationDate: Date;
};

const FeedPostTile = ({ userPostData }: PostData) => {
  const [postUserData, setPostUserData] = useState<
    PostUserData[] | undefined
  >();
  const [creationDate, setCreationDate] = useState<string>("");
  const [postImg, setPostImg] = useState<string>();
  const [previewFull, setPreviewFull] = useState<boolean>(false);
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  //date format

  const dateCreated = () => {
    const memberMonth = new Date(userPostData?.creationDate!)
      .getMonth()
      .toString();
    const memberDay = new Date(userPostData?.creationDate!)
      .getDate()
      .toString();
    const memberYear = new Date(userPostData?.creationDate!)
      .getFullYear()
      .toString();

    setCreationDate(`${memberMonth}/${memberDay}/${memberYear}`);
  };

  //tile user Data

  const tileUserData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-users?postTile=true&postUser=${userPostData?.userId}`
      );
      setPostUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPostImg = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-posts?fetchPostImg=true&postImgId=${userPostData?.postImg}`
    );

    if (res.data != false) {
      setPostImg(res.data);
    } else {
      setPostImg("");
    }
  };
  //get last tile for scroll

  useEffect(() => {
    if (userPostData != undefined) {
      dateCreated();
      tileUserData();
    }

    if (userPostData?.postImg != null) {
      fetchPostImg();
    }
  }, [userPostData]);

  return (
    <>
      {userPostData != undefined ? (
        <div className="feed__tile">
          <div className="post__top--wrapper">
            <div className="top__creation--container">
              <div className="post__category--tile">
                {categories
                  .filter((el) => el.title == userPostData.category)
                  .map((data) => (
                    <i key={data.id} className={data.icon}></i>
                  ))}
                <p>{userPostData.category}</p>
              </div>

              {mobileMedia == false ? (
                <i className="fa-solid fa-circle"></i>
              ) : null}

              <div
                className="author"
                onClick={() => {
                  window.location.href = `${window.location.origin}/user/${
                    postUserData![0].username
                  }/${postUserData![0]._id}`;
                }}
              >
                <h4>
                  By:{" "}
                  <span>
                    {postUserData != undefined
                      ? postUserData[0].username
                      : null}
                  </span>
                </h4>
              </div>

              {mobileMedia == false ? (
                <i className="fa-solid fa-circle"></i>
              ) : null}
              {mobileMedia == false ? (
                <h4 className="create-date">{creationDate}</h4>
              ) : null}
            </div>
            {userPostData != undefined ? (
              <PostLike userPostData={userPostData} />
            ) : null}
          </div>
          <div
            className="post__content--container post__content--feed"
            onClick={() => {
              window.location.href = `/post/${userPostData._id}`;
            }}
          >
            <h2 className="post__tile--title">{userPostData.title}</h2>
            <h3 className="post__tile--header">{userPostData.headline}</h3>
            {userPostData.postImg != null ? (
              <PostImg
                postImg={postImg}
                previewFull={previewFull}
                setPreviewFull={setPreviewFull}
                post={!false}
              />
            ) : null}
            <div className="feed__tile--bottom">
              <p className="post__tile--body">
                {userPostData.postBody?.trim().substring(0, 1100)}
              </p>
              <div className="tile__fade"></div>
            </div>
          </div>
          {postUserData != undefined ? (
            <PostInteractions
              postId={userPostData._id}
              feedTile={true}
              postImg={userPostData.postImg}
            />
          ) : null}
        </div>
      ) : (
        emptyData
          .filter((el) => el.id == 1)
          .map((data, key) => <EmptyContent data={data} key={key} />)
      )}
    </>
  );
};
export default FeedPostTile;
