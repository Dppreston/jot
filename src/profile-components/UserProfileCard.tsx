import axios from "axios";
import logo from "../assets/profile__pic--filler.png";
import { useContext, useEffect, useState } from "react";
import categories from "../staticdata/Categories";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";
import Follow from "./Follow";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const token: string | null = localStorage.getItem("token");

type DashboardUserProfileTileProps = {
  userData?:
    | {
        _id: string;
        username: string;
        creationDate: Date;
        savedPosts: string[];
        profilePicture: string;
        favoriteCategories: number[];
        bio: string;
        profileImgVersion?: number;
      }
    | undefined;
  memberSince: string;
  master: boolean;
  privateProfile: boolean;
  ffAction?: (res: number) => void;
};

type Favorite = {
  id: number;
  title: string;
  icon: string;
};

type UserTop = {
  _id: string;
  headline: string;
  postBody: string;
  category: string;
  title: string;
};

type CommentTop = {
  _id: string;
  commentBody: string;
  commentDislikes: number;
  commentLikes: number;
  postId: string;
};

const UserProfileTile = ({
  userData,
  privateProfile,
  memberSince,
  master,
  ffAction,
}: DashboardUserProfileTileProps) => {
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalDislikes, setTotalDislikes] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalFollowers, setTotalFollowers] = useState<number>(0);
  const [totalFollowing, setTotalFollowing] = useState<number>(0);
  const [userFavorites, setUserFavorites] = useState<Favorite[]>();
  const [followCheckRes, setFollowCheckRes] = useState<boolean>(false);
  const [userTop, setUserTop] = useState<UserTop[]>();
  const [commentTop, setCommentTop] = useState<CommentTop[]>();

  // const [changeFavoritesActive, setChangeFavoritesActive] =
  //   useState<boolean>(false);
  const {
    darkActive,
    loggedin,
    mobileMedia,
    setExistingBio,
    setBioActive,
    bioActive,
    setChangeFavoritesActive,
    changeFavoritesActive,
    setUserFavoritesForUpdate,
  } = useContext<GlobalContext>(UserContext);

  //fetch total likes and dislikes && post length && comments && followers

  const fetchTotalPostLikesDislikes = async () => {
    const totalLikes = await axios.get(
      `http://localhost:1000/jot-posts?userTileTotalLikes=true&userId=${
        userData!?._id
      }`
    );
    setTotalPosts(totalLikes.data[1]);
    setTotalLikes(totalLikes.data[0]);

    const totalDislikes = await axios.get(
      `http://localhost:1000/jot-posts?userTileTotalDislikes=true&userId=${
        userData!?._id
      }`
    );
    setTotalDislikes(totalDislikes.data);

    //total followers and following

    const totalFollowersFollowing = await axios.get(
      `http://localhost:1000/jot-users?totalFollowersFollowing=true&userId=${userData?._id}`
    );
    setTotalFollowers(totalFollowersFollowing.data[0]);
    setTotalFollowing(totalFollowersFollowing.data[1]);
  };

  //favorite categories

  const userFavoriteCategories = () => {
    const favoriteData = categories.filter((data) =>
      userData?.favoriteCategories.some((el) => data.id == el)
    );
    setUserFavorites(favoriteData);
  };

  //handling follow

  const followUser = async () => {
    // add / remove following to user
    await axios.put(
      `http://localhost:1000/jot-users?following=true&userId=${token}&currentUserId=${userData?._id}`
    );

    //add / remove follower to user
    await axios.put(
      `http://localhost:1000/jot-users?follower=true&userId=${userData?._id}&currentUserId=${token}`
    );

    setTimeout(() => {
      followingCheck();
    }, 100);
  };

  //top posts
  const userTopPosts = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-posts?userTopPosts=true&userId=${userData?._id}`
    );
    setUserTop(res.data);
  };

  //top comments

  const userTopComments = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-comments?userTopComments=true&userId=${userData?._id}`
    );
    setCommentTop(res.data);
  };

  //following check

  const followingCheck = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?followingCheck=true&userId=${token}&profileId=${userData?._id}`
    );
    setFollowCheckRes(res.data);
  };

  useEffect(() => {
    fetchTotalPostLikesDislikes();
    userFavoriteCategories();
    userTopPosts();
    userTopComments();

    if (loggedin == !false) {
      followingCheck();
    }
  }, [userData]);

  useEffect(() => {
    window.loginCheck(token);

    darkActive == !false ? window.darkMode() : null;
  }, [[], bioActive, changeFavoritesActive]);
  return (
    <>
      <div className="profile__card--wrapper">
        <div className="profile__card--upper">
          <div className="profile__card--upper--top">
            {mobileMedia == !false ? (
              <img
                src={
                  userData?.profilePicture != ""
                    ? `${userData?.profilePicture}.js?version=${userData?.profileImgVersion}`
                    : logo
                }
                alt="profile__card--img"
                id="mobile__profile--card--img"
                loading="lazy"
              />
            ) : null}

            <div className="profile__card--info--container">
              <h3 className="user__info--username ">{userData?.username}</h3>
              {mobileMedia == !false ? (
                <div
                  className="total__following--followers--container"
                  style={
                    privateProfile == !false && followCheckRes == false
                      ? { pointerEvents: "none" }
                      : undefined
                  }
                >
                  <button
                    className="follower__style"
                    onClick={() => ffAction!(1)}
                    style={
                      totalFollowers == 0
                        ? { pointerEvents: "none" }
                        : undefined
                    }
                  >
                    <div className="follower__count--container">
                      <h3>{totalFollowers}</h3>
                    </div>
                    <p>Followers </p>
                  </button>
                  <button
                    className="follower__style"
                    onClick={() => ffAction!(2)}
                    style={
                      totalFollowing == 0
                        ? { pointerEvents: "none" }
                        : undefined
                    }
                  >
                    <div className="follower__count--container">
                      <h3>{totalFollowing}</h3>
                    </div>
                    <p>Following </p>
                  </button>
                </div>
              ) : null}
              {mobileMedia == false ? (
                <p className="member__since">Member since: {memberSince}</p>
              ) : null}
            </div>
            <div className="follow__container">
              {mobileMedia == false ? (
                <div
                  className="total__following--followers--container"
                  style={
                    privateProfile == !false && followCheckRes == false
                      ? { pointerEvents: "none" }
                      : undefined
                  }
                >
                  <button
                    className="follower__style"
                    onClick={() => ffAction!(1)}
                    style={
                      totalFollowers == 0
                        ? { pointerEvents: "none" }
                        : undefined
                    }
                  >
                    <div className="follower__count--container">
                      <h3>{totalFollowers}</h3>
                    </div>
                    <p>Followers </p>
                  </button>
                  <button
                    className="follower__style"
                    onClick={() => ffAction!(2)}
                    style={
                      totalFollowing == 0
                        ? { pointerEvents: "none" }
                        : undefined
                    }
                  >
                    <div className="follower__count--container">
                      <h3>{totalFollowing}</h3>
                    </div>
                    <p>Following </p>
                  </button>
                </div>
              ) : null}

              {mobileMedia == false ? (
                <Follow
                  userId={userData?._id}
                  followUser={followUser}
                  followCheckRes={followCheckRes}
                  privateProfile={privateProfile}
                />
              ) : null}
            </div>
            {mobileMedia == !false ? (
              <Follow
                userId={userData?._id}
                followUser={followUser}
                followCheckRes={followCheckRes}
                privateProfile={privateProfile}
              />
            ) : null}
          </div>
          <div className="private__profile--wrapper">
            {privateProfile == !false &&
            followCheckRes == false &&
            userData?._id != token ? (
              <div
                className="private__profile--cover"
                style={
                  darkActive == !false
                    ? { background: "rgba(56, 53, 54, .1)" }
                    : undefined
                }
              ></div>
            ) : null}
            {privateProfile == !false &&
            followCheckRes == false &&
            userData?._id != token ? (
              <div
                className="private__profile--support--wrapper"
                style={
                  darkActive == !false
                    ? { background: "var(--hover-on-black-DM)" }
                    : undefined
                }
              >
                <LazyLoadImage
                  src={
                    userData?.profilePicture != ""
                      ? `${userData?.profilePicture}.js?version=${userData?.profileImgVersion}`
                      : logo
                  }
                  alt="profile__card--img"
                  id="private__profile--img"
                  effect="blur"
                />
                <h4>Follow {userData?.username} to view their profile</h4>
                <i className="fa-solid fa-lock private__lock"></i>
              </div>
            ) : null}
            <div
              className="profile__card--user--summary--container"
              style={
                darkActive == !false
                  ? { background: "var(--hover-DM)" }
                  : undefined
              }
            >
              {mobileMedia == false ? (
                <div className="profile__card--img--container">
                  <img
                    src={
                      userData?.profilePicture != ""
                        ? `${userData?.profilePicture}.js?version=${userData?.profileImgVersion}`
                        : logo
                    }
                    alt="profile__card--img"
                    id="profile__card--img"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="user__bio--wrapper">
                <div className="user__favorite--title--container">
                  {" "}
                  <h4>About {userData?.username}</h4>{" "}
                  {master == true ? (
                    <Button
                      content={"fa-regular fa-pen-to-square"}
                      action={setBioActive}
                      optionalValue={!false}
                      secondAction={setExistingBio}
                      secondOptionalValue={userData?.bio}
                      icon={true}
                      inactive={!false}
                    />
                  ) : null}
                </div>

                <p id="profile__card--bio">{userData?.bio}</p>
                <div className="profile__card--highlights--container">
                  <div className="user__total--likes highlight__style">
                    <p>Likes -</p> <h4>{totalLikes}</h4>
                  </div>
                  |
                  <div className="user__total--dislikes highlight__style">
                    <p>Dislikes -</p>
                    <h4>{totalDislikes}</h4>
                  </div>
                  |
                  <div className="user__total--posts highlight__style">
                    <p>Total Posts -</p> <h4>{totalPosts}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="user__tile--right--component--wrapper user__favorite--categories--wrapper">
              <div className="user__favorite--title--container">
                <h4 className="right__component--title">
                  Their Favorite Categories
                </h4>
                {master == true ? (
                  <Button
                    content={"fa-regular fa-pen-to-square"}
                    action={setChangeFavoritesActive}
                    optionalValue={!false}
                    secondAction={setUserFavoritesForUpdate}
                    secondOptionalValue={userData?.favoriteCategories}
                    icon={true}
                    inactive={!false}
                  />
                ) : null}
              </div>
              <div className="user__tile--favorite--category--tile--container ">
                {userFavorites!?.length > 0
                  ? userFavorites?.map((data) => (
                      <section className="post__category--tile" key={data.id}>
                        <i className={data.icon}></i> <p>{data.title}</p>
                      </section>
                    ))
                  : null}
              </div>
            </div>
            <div className="user__tile--right--component--wrapper user__top--comments--wrapper ">
              <div className="user__posts--title--container">
                <h4 className="right__component--title">Their Top Comments</h4>
              </div>
              <div className="top__comments--container">
                {commentTop!?.length > 0 ? (
                  commentTop!?.map((data) => (
                    <button
                      className="user__tile--top--comment--tile"
                      key={data._id}
                      onClick={() => {
                        window.location.href = `${window.location.origin}/post/${data.postId}`;
                      }}
                      style={
                        darkActive == !false
                          ? {
                              border: "var(--border-on-hover-DM)",
                              color: "var(--white-DM)",
                            }
                          : undefined
                      }
                    >
                      <div className="user__top--comment--top--container">
                        <div className="top__comment--ineraction--container">
                          <i
                            className="fa-regular fa-thumbs-up"
                            style={
                              darkActive == !false
                                ? { color: "var(--accent)" }
                                : undefined
                            }
                          ></i>{" "}
                          <p>{data.commentLikes}</p> |
                          <i
                            className="fa-regular fa-thumbs-down"
                            style={
                              darkActive == !false
                                ? { color: "var(--accent)" }
                                : undefined
                            }
                          ></i>{" "}
                          <p>{data.commentDislikes}</p>
                        </div>

                        <p className="top__comment--data">
                          {data.commentBody.substring(0, 25)}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="empty__user">
                    <img src={logo} alt="jot-logo" id="empty__user--img" />
                    <h4>This user has no comments </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile__card--lower">
          <div className="user__top--posts--top--container">
            <h4>Their Top Posts</h4>
            {userTop!?.length > 0 ? (
              <button
                className="user__full--posts--btn"
                onClick={() =>
                  (window.location.href = `${window.location.origin}/user-posts/${userData?.username}/${userData?._id}`)
                }
              >
                <p>See all</p>
              </button>
            ) : null}
          </div>
          <div className="user__top--posts--lower--container">
            {userTop!?.length > 0 ? (
              userTop?.map((data) => (
                <button
                  className="user__top--post--tile"
                  key={data._id}
                  onClick={() =>
                    (window.location.href = `${window.location.origin}/post/${data._id}`)
                  }
                >
                  <div className="user__top--post--upper">
                    {" "}
                    <span className="post__category--tile">
                      {data.category}
                    </span>{" "}
                    <h3>{data.title.substring(0, 70)} ...</h3>
                  </div>
                  <div className="user__top--post--lower">
                    {mobileMedia == false ? (
                      <h4>{data.headline.substring(0, 80)} ...</h4>
                    ) : null}

                    <p>{data.postBody.substring(0, 360)}...</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty__user">
                <img src={logo} alt="jot-logo" id="empty__user--img" />
                <h4>This user has no posts </h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileTile;
