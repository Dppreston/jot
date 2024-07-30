import { useParams } from "react-router";
import Navbar from "../main-components/Navbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PostLike from "../post-components/PostLikes";
import PostInteractions from "../post-components/PostInteractions";
import Comments from "../comment-components/Comments";
import categories from "../staticdata/Categories";

import PostImg from "../post-components/PostImg";
import { GlobalContext, UserContext } from "../App";
import ProfileSideTile from "../side-components/ProfileSideTile";
type PostData = {
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
  postImg?: string;
  postImgVersion?: number;
};
type PostDataProps = {
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
        postImg?: string;
        postImgVersion?: number;
      }[]
    | undefined;

  userData: {
    _id: string;
    username: string;
    password: string;
    lastName: string;
    firstName: string;
    email: string;
    creationDate: Date;
  }[];
  creationDate: string | undefined;
};

type UserData = {
  _id: string;
  username: string;
  password: string;
  lastName: string;
  firstName: string;
  email: string;
  creationDate: Date;
  profilePicture: string;
  profileImgVersion: number;
};

type OtherPostsProps = {
  username: string;
  otherPostData: PostData[] | undefined;
  existingPostId: string | undefined;
};
let tilePosition = 0;

export const OtherPostsByUser = ({
  username,
  otherPostData,
  existingPostId,
}: OtherPostsProps) => {
  const { mobileMedia } = useContext<GlobalContext>(UserContext);
  const [scrollBack, setScrollBack] = useState<boolean>(false);
  const [scrollForward, setScrollForward] = useState<boolean>(!false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  //scroll buttons for tiles

  const scrollPosition = (position: number, button: string) => {
    let container = document.querySelector(".other__posts--lower--container");
    let tileLength =
      document.querySelectorAll("#other__posts--tile").length - 1;

    if (position != 0) {
      setScrollBack(!false);
    } else {
      setScrollBack(false);
    }

    if (position == tileLength) {
      setScrollForward(false);
    } else {
      setScrollForward(!false);
    }

    if (button == "forward") {
      container?.children[position].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
    if (button == "backward") {
      container?.children[position].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };
  return (
    <>
      <div
        className="other__posts--container"
        onMouseEnter={() => setMouseOver(!false)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <div className="other__posts--top--container">
          <h4>{username}'s other posts</h4>
          <button
            id="see__all"
            onClick={() =>
              (window.location.href = `${
                window.location.origin
              }/user-posts/${username}/${otherPostData![0]?.userId}`)
            }
          >
            <h5>See all</h5>
          </button>
        </div>

        <div className="other__posts--lower--container">
          {otherPostData
            ?.filter((data) => data._id !== existingPostId)
            .map((data) => (
              <button
                id="other__posts--tile"
                key={data._id}
                onClick={() => {
                  window.location.href = `${window.location.origin}/post/${data._id}`;
                }}
              >
                <div className="other__post--tile--top--container">
                  <section className="post__category--tile">
                    {categories
                      .filter((cat) => cat.title.includes(data.category!))
                      .map((res) => (
                        <i className={res.icon} key={res.id}></i>
                      ))}
                    <p>{data.category}</p>
                  </section>
                  <h5>{new Date(data.creationDate!).toLocaleDateString()}</h5>
                </div>
                <h3>
                  {data.title?.substring(0, 150)}
                  ...
                </h3>

                <h4>
                  {data.postBody?.substring(0, 140)}
                  ...
                </h4>
              </button>
            ))}
          {mobileMedia == false &&
          scrollBack == !false &&
          mouseOver == !false ? (
            <div
              className="tile__slider--button slider--left"
              onClick={() => {
                tilePosition = tilePosition - 1;
                scrollPosition(tilePosition, "backward");
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </div>
          ) : null}
        </div>
        {mobileMedia == false &&
        scrollForward != false &&
        mouseOver == !false ? (
          <div
            className="tile__slider--button slider--right"
            onClick={() => {
              tilePosition = tilePosition + 1;
              scrollPosition(tilePosition, "forward");
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        ) : null}
      </div>
    </>
  );
};

export const PostDisplay = ({
  postData,
  userData,
  creationDate,
}: PostDataProps) => {
  const [postImg, setPostImg] = useState<string>();
  const [previewFull, setPreviewFull] = useState<boolean>(false);
  const categoryIconMatch = categories.find(
    (res) => res.title == postData![0]?.category
  );
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  const fetchPostImg = async () => {
    const res = await axios.get(
      `/jot-posts?fetchPostImg=true&postImgId=${postData![0].postImg}`
    );

    if (res.data != false) {
      setPostImg(res.data);
    } else {
      setPostImg("");
    }
  };

  useEffect(() => {
    if (postData![0].postImg != null && postData != undefined) {
      fetchPostImg();
    }
  }, [postData]);

  return (
    <>
      {postData?.map((post) => (
        <div className="post__display" key={post._id}>
          <div className="post__top--container">
            <div className="post__creation--container">
              <section className="post__category--tile">
                {categoryIconMatch ? (
                  <i className={categoryIconMatch.icon}></i>
                ) : null}{" "}
                <p> {postData[0].category}</p>
              </section>
              <h4>
                By :{" "}
                <button
                  className="go__to--user"
                  onClick={() => {
                    window.location.href = `${window.location.origin}/user/${userData[0].username}/${userData[0]._id}`;
                  }}
                >
                  <h4>{userData ? userData[0].username : null}</h4>
                </button>
              </h4>
              {mobileMedia == false ? (
                <i className="fa-solid fa-circle post__circle--spacer"></i>
              ) : null}
              {mobileMedia == false ? <p>{creationDate}</p> : null}

              {postData ? <PostLike userPostData={postData} /> : null}
            </div>
          </div>
          <div className="post__content--container">
            <h2 className="post__title">{post.title}</h2>
            <h3 className="post__headline">{post.headline}</h3>

            <PostImg
              postImg={postImg}
              previewFull={previewFull}
              setPreviewFull={setPreviewFull}
              postFinal={!false}
            />

            <p>{post.postBody?.trim()}</p>
          </div>
          <PostInteractions
            postId={post._id}
            postImg={postImg ? postData![0].postImg : ""}
          />
        </div>
      ))}
    </>
  );
};

const Post = () => {
  const { postId } = useParams();
  const [postData, setPostdata] = useState<PostData[]>();
  const [postLoaded, setPostLoaded] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData[]>();
  const [otherPosts, setOtherPosts] = useState<PostData[]>();
  const [memberSince, setMemberSince] = useState<string>("");
  const [creationDate, setCreationDate] = useState<string>("");
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  const fetchPostFinal = async () => {
    try {
      const res = await axios.get(`/jot-posts?postFinal=true&postId=${postId}`);

      if (res.data != null) {
        setPostdata(res.data);
        setPostLoaded(!false);
      } else {
        setPostdata(undefined);
        window.location.href = `${window.location.origin}/error/${postId}/404`;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPostUserFinal = async () => {
    try {
      const res = await axios.get(
        `/jot-users?userFinal=true&postUserId=${postData![0].userId}`
      );
      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //other posts by user

  const fetchOtherPosts = async () => {
    const res = await axios.get(
      `/jot-posts?otherPosts=true&userId=${userData![0]._id}`
    );
    setOtherPosts(res.data);
  };

  //date joined

  const dates = () => {
    const joinedDate = new Date(userData![0].creationDate).toLocaleDateString();
    const creationDate = new Date(
      postData![0]?.creationDate!
    ).toLocaleDateString();

    setCreationDate(creationDate);
    setMemberSince(joinedDate);
  };

  useEffect(() => {
    fetchPostFinal();
  }, []);

  useEffect(() => {
    if (postData != undefined) {
      fetchPostUserFinal();
    }
  }, [postData]);

  useEffect(() => {
    if (userData != undefined) {
      fetchOtherPosts();
      dates();
    }
  }, [userData]);

  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper post__final--wrapper">
          <div className="site__column--wrapper">
            {mobileMedia == !false && userData != undefined ? (
              <ProfileSideTile
                username={userData[0].username}
                profilePic={userData[0].profilePicture}
                userId={userData[0]._id}
                memberSince={memberSince}
                imgVersion={userData[0].profileImgVersion}
                button={true}
              />
            ) : null}
            {postData != undefined ? (
              <PostDisplay
                postData={postData}
                userData={userData!}
                creationDate={creationDate}
              />
            ) : null}
            {postLoaded == !false ? <Comments postData={postData} /> : null}
            {mobileMedia == !false && userData != undefined ? (
              <OtherPostsByUser
                username={userData![0].username}
                otherPostData={otherPosts}
                existingPostId={postId}
              />
            ) : null}
          </div>
          {mobileMedia == false ? (
            <div className="site__column--wrapper">
              {userData != undefined ? (
                <ProfileSideTile
                  username={userData[0].username}
                  profilePic={userData[0].profilePicture}
                  userId={userData[0]._id}
                  memberSince={memberSince}
                  imgVersion={userData[0].profileImgVersion}
                  button={true}
                />
              ) : null}
              {userData != undefined ? (
                <OtherPostsByUser
                  username={userData[0].username}
                  otherPostData={otherPosts}
                  existingPostId={postId}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default Post;
