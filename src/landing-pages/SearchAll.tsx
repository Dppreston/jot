import { useParams } from "react-router";
import Navbar from "../main-components/Navbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/jot-logo.png";
import categories from "../staticdata/Categories";
import { GlobalContext, UserContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const token: string | null = localStorage.getItem(`token`);

type SearchRes = {
  _id?: string;
  category?: string;
  title?: string;
  userId?: string;
  username: string;
  profilePicture?: string;
  postBody?: string;
  headline?: string;
  profileImgVersion?: number;
};

type CategoryRes = {
  id: number;
  icon: string;
  title: string;
};

type SearchResProps = {
  searchResData: {
    _id?: string;
    category?: string;
    title?: string;
    userId?: string;
    username?: string;
    profilePicture?: string;
    postBody?: string;
    headline?: string;
  };
  imgVersion?: number;
};

type CategoryResProps = {
  categoryResData: {
    id: number;
    icon: string;
    title: string;
  };
};

export const SearchAllPostTile = ({ searchResData }: SearchResProps) => {
  const [postUsername, setPostUsername] = useState<string>("");

  const { mobileMedia, mobileTextLimit } =
    useContext<GlobalContext>(UserContext);

  //post username fetch

  const postUsernameFetch = async () => {
    const res = await axios.get(
      `/jot-users?searchAllUsername=true&userId=${searchResData.userId}`
    );
    setPostUsername(res.data[0].username);
  };

  useEffect(() => {
    if (searchResData != undefined) {
      postUsernameFetch();
    }
  }, [searchResData]);

  return (
    <>
      <button
        className="search__all--post--tile"
        onClick={() =>
          (window.location.href = `${window.location.origin}/post/${searchResData._id}`)
        }
      >
        <div className="search__all--post--tile--top">
          <div className="post__category--tile">
            {categories
              .filter((cat) => cat.title === searchResData.category)
              .map((el) => (
                <i className={el.icon} key={el.id}></i>
              ))}
            <p>{searchResData.category}</p>
          </div>

          <h3>
            {searchResData.title?.substring(
              0,
              mobileMedia == false ? 55 : mobileTextLimit
            )}{" "}
            ...
          </h3>
          {mobileMedia == false ? (
            <h4 className="search__all--post--username">By: {postUsername}</h4>
          ) : null}
        </div>
        <div className="search__all--post--tile--bottom">
          {mobileMedia == false ? (
            <h4>{searchResData.headline?.substring(0, 100)}...</h4>
          ) : null}
          {mobileMedia == false ? (
            <p>
              {searchResData.postBody?.substring(0, 300)}
              ...
            </p>
          ) : null}
        </div>
      </button>
    </>
  );
};

export const SearchAllUserTile = ({
  searchResData,
  imgVersion,
}: SearchResProps) => {
  return (
    <>
      <div
        className="search__all--user--tile"
        onClick={() =>
          (window.location.href = `${window.location.origin}/user/${searchResData.username}/${searchResData._id}`)
        }
      >
        <div className="search__all--img--container">
          <LazyLoadImage
            src={
              searchResData.profilePicture != ""
                ? `${searchResData.profilePicture}.js?version=${imgVersion}`
                : logo
            }
            id="search__all--tile--img"
            style={
              searchResData.profilePicture != ""
                ? { width: "inherit", height: "inherit" }
                : { width: "auto", height: "75%" }
            }
            effect="blur"
            height={"inherit"}
            width={"inherit"}
          />
        </div>
        <h4>{searchResData.username}</h4>
      </div>
    </>
  );
};

export const SearchAllCategoryTile = ({
  categoryResData,
}: CategoryResProps) => {
  const { mobileMedia } = useContext<GlobalContext>(UserContext);
  return (
    <>
      {mobileMedia == false ? (
        <button
          className="post__category--tile"
          onClick={() =>
            (window.location.href = `${window.location.origin}/home/${categoryResData.title}`)
          }
        >
          <i className={categoryResData.icon}></i>{" "}
          <p>{categoryResData.title}</p>
        </button>
      ) : (
        <button
          className="post__category--tile--mobile"
          style={
            mobileMedia == !false ? { flexDirection: "column" } : undefined
          }
          onClick={() =>
            (window.location.href = `${window.location.origin}/home/${categoryResData.title}`)
          }
        >
          <i className={categoryResData.icon}></i>{" "}
          <p>{categoryResData.title}</p>
        </button>
      )}
    </>
  );
};

const SearchAll = () => {
  const { searchContent } = useParams();
  const [postSearchRes, setPostSearchRes] = useState<SearchRes[]>();
  const [userSearchRes, setUserSearchRes] = useState<SearchRes[]>();
  const [categorySearchRes, setCategorySearchRes] = useState<CategoryRes[]>();
  const [userShowingLength, setUserShowingLength] = useState<number>(0);
  const [categoryLength, setCategoryLength] = useState<number>(0);
  const [postShowingLength, setPostShowingLength] = useState<number>(0);
  const [postMasterLength, setPostMasterLength] = useState<number>(0);
  const [userMasterLength, setUserMasterLength] = useState<number>(0);
  const [userEmpty, setUserEmpty] = useState<boolean>(false);
  const [postEmpty, setPostEmpty] = useState<boolean>(false);
  const { loggedin, mobileMedia } = useContext<GlobalContext>(UserContext);

  //post search

  const searchPosts = async () => {
    const res = await axios.get(
      `/jot-posts?postSearch=true&searchQuery=${searchContent}`
    );
    setPostSearchRes(res.data[0]);
    setPostShowingLength(res.data[0].length);
    setPostMasterLength(res.data[1]);

    if (res.data[0].length === 0) {
      const res = await axios.get(`/jot-posts?searchAllPopular=true`);
      setPostSearchRes(res.data);
      setPostEmpty(!false);
    }
  };

  //load more posts

  const loadMorePosts = async () => {
    const res = await axios.get(
      `/jot-posts?loadMorePosts=true&searchQuery=${searchContent}&postDynamicLength=${postShowingLength}`
    );

    setPostSearchRes(res.data[0]);
    setPostShowingLength(res.data[0].length);
  };

  //user search

  const searchUsers = async () => {
    const res = await axios.get(
      `/jot-users?userSearch=true&searchQuery=${searchContent}&searchAll=true`
    );

    setUserSearchRes(res.data[0]);
    setUserShowingLength(res.data[0].length);
    setUserMasterLength(res.data[1]);

    if (res.data[0].length === 0) {
      if (loggedin == !false) {
        const res = await axios.get(
          `/jot-users?recommendedUsers=true&userId=${token} `
        );
        setUserEmpty(!false);
        setUserSearchRes(res.data);
      } else {
        const res = await axios.get(
          `/jot-users?loggedOutRecommendedUsers=true`
        );
        setUserEmpty(!false);
        setUserSearchRes(res.data);
      }
    }
  };

  //load more posts

  const loadMoreUsers = async () => {
    const res = await axios.get(
      `/jot-users?loadMoreUsers=true&searchQuery=${searchContent}&userDynamicLength=${userShowingLength}`
    );
    setUserSearchRes(res.data[0]);
    setUserShowingLength(res.data[0].length);
  };

  //category search

  const searchCategories = () => {
    const filtered = categories.filter(
      (cat) => searchContent?.toLowerCase() === cat.title
    );
    setCategorySearchRes(filtered);
    setCategoryLength(filtered.length);

    if (filtered.length === 0) {
      let currentIndex = categories.length;

      while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [categories[currentIndex], categories[randomIndex]] = [
          categories[randomIndex],
          categories[currentIndex],
        ];

        setCategorySearchRes(categories.slice(0, 6));
      }
    }
  };

  useEffect(() => {
    searchPosts();
    searchUsers();
    searchCategories();
  }, []);
  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper search__all--wrapper">
          <div className="site__column--wrapper">
            <div className="search__summary--bar">
              <i className="fa-solid fa-search"></i>
              <h3>
                Search results for <span>{searchContent}</span>
              </h3>
            </div>
            <div className="search__all--user--container search__all--container">
              <div className="search__all--top--container">
                <h3>Users</h3> |{" "}
                {userShowingLength > 0 ? (
                  <p>
                    {userShowingLength} result(s) of {userMasterLength}
                  </p>
                ) : (
                  <p> 0 results - Here are some recommended accounts... </p>
                )}
              </div>
              <div className="search__all--lower--container search__all--lower--users">
                <div
                  className="search__all--users--lower--left"
                  style={
                    mobileMedia == !false && userSearchRes!?.length > 2
                      ? { justifyContent: "center" }
                      : undefined
                  }
                >
                  {userSearchRes!?.length > 0
                    ? userSearchRes!?.map((data, key) => (
                        <SearchAllUserTile
                          searchResData={data}
                          imgVersion={data.profileImgVersion}
                          key={key}
                        />
                      ))
                    : null}
                </div>

                <div className="search__all--users--lower--right">
                  {userEmpty == !false ? (
                    <button
                      id="shuffle__users"
                      className="all__post--load--button"
                      onClick={() => {
                        searchUsers();
                      }}
                    >
                      <i className="fa-solid fa-shuffle"></i>
                      <p>Shuffle</p>
                    </button>
                  ) : userEmpty == false &&
                    userSearchRes!?.length != userMasterLength ? (
                    <button
                      id="load__more--users"
                      className="all__post--load--button"
                      onClick={() => {
                        loadMoreUsers();
                      }}
                    >
                      <i className="fa-solid fa-plus"></i> <p>More</p>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="search__all--category--container search__all--container">
              <div className="search__all--top--container">
                <h3>Categories</h3> |{" "}
                {categoryLength > 0 ? (
                  <p>{categoryLength} result(s)</p>
                ) : (
                  <p> 0 - Here's some popular categories...</p>
                )}
              </div>
              <div
                className="search__all--lower--container"
                style={
                  mobileMedia == !false
                    ? { justifyContent: "flex-start" }
                    : undefined
                }
              >
                {categorySearchRes!?.length > 0
                  ? categorySearchRes?.map((data, key) => (
                      <SearchAllCategoryTile key={key} categoryResData={data} />
                    ))
                  : null}
              </div>
            </div>
            <div className="search__all--container ">
              <div className="search__all--top--container">
                <h3>Posts</h3> |{" "}
                {postShowingLength > 0 ? (
                  <p>
                    {postShowingLength} result(s) of {postMasterLength}
                  </p>
                ) : (
                  <p>0 results - Here's popular posts...</p>
                )}
              </div>
              <div className="search__all--lower--container search__all--post--container">
                {postSearchRes!?.length > 0
                  ? postSearchRes?.map((data, key) => (
                      <SearchAllPostTile key={key} searchResData={data} />
                    ))
                  : null}
              </div>
            </div>
            {postEmpty == false &&
            postSearchRes!?.length != postMasterLength ? (
              <button
                id="load__more--posts"
                className="all__post--load--button"
                onClick={() => {
                  loadMorePosts();
                }}
              >
                <i className="fa-solid fa-plus"></i> <p>Load More</p>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchAll;
