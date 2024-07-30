import { useContext, useEffect, useState } from "react";
import logo from "../assets/profile__pic--filler.png";
import axios from "axios";
import categories from "../staticdata/Categories";
import { GlobalContext, UserContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Button from "../buttons/ButtonMain";
const token: string | null = localStorage.getItem("token");

type SearchRes = {
  _id: string;
  category?: string;
  title?: string;
  userId: string;
  username: string;
  profilePicture?: string;
  profileImgVersion?: number;
};

type SearchContentProps = {
  searchContent: string;
};

type ImgProps = {
  profilePic: string | undefined;
  imgVersion?: number;
};

//Search profile img

export const SearchProfileImg = ({ profilePic, imgVersion }: ImgProps) => {
  return (
    <>
      <section className="search__tile--img--container">
        <LazyLoadImage
          src={
            profilePic != "" ? `${profilePic}.js?version=${imgVersion}` : logo
          }
          id="search__tile--img"
          style={
            profilePic != ""
              ? { width: "inherit", height: "inherit" }
              : { width: "auto", height: "75%" }
          }
          effect="blur"
          height={"inherit"}
          width={"inherit"}
        />
      </section>
    </>
  );
};

//search dropdown component

export const SearchDropdown = ({ searchContent }: SearchContentProps) => {
  const [postSearchRes, setPostSearchRes] = useState<SearchRes[]>();
  const [userSearchRes, setUserSearchRes] = useState<SearchRes[]>();
  const { darkActive, mobileMedia } = useContext<GlobalContext>(UserContext);
  //post search

  const searchPosts = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-posts?postSearch=true&searchQuery=${searchContent}`
    );
    setPostSearchRes(res.data[0]);
  };
  //user search

  const searchUsers = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?userSearch=true&searchQuery=${searchContent}&searchAll=false`
    );
    setUserSearchRes(res.data[0]);
  };

  useEffect(() => {
    setTimeout(() => {
      searchPosts();
      searchUsers();
    }, 500);
  }, [searchContent]);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [[], postSearchRes, userSearchRes]);

  return (
    <>
      <div className="search__dropdown">
        <div className="search__section--wrapper">
          <h4>Posts</h4>
          {postSearchRes != undefined && postSearchRes.length >= 1 ? (
            postSearchRes.map((data) => (
              <button
                className="search__tile post__search--tile"
                key={data._id}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `${window.location.origin}/post/${data._id}`;
                }}
              >
                <div className="search__category--spacer">
                  <section className="post__category--tile">
                    {categories
                      .filter((el) => el.title === data.category!)
                      .map((res) => (
                        <i className={res.icon} key={res.id}></i>
                      ))}

                    <p>{data?.category}</p>
                  </section>
                </div>
                <p className="search__post--title">
                  {data.title?.substring(0, 70)}...
                </p>
              </button>
            ))
          ) : (
            <div className="empty__search">
              <p>Hmmm.... No posts were found.</p>
            </div>
          )}
        </div>
        <div className="search__section--wrapper">
          <h4>Users</h4>
          {userSearchRes != undefined && userSearchRes.length >= 1 ? (
            userSearchRes.map((data) => (
              <button
                className="search__tile user__search--tile"
                key={data._id}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `${window.location.origin}/user/${data.username}/${data._id}`;
                }}
              >
                <SearchProfileImg
                  profilePic={data.profilePicture}
                  imgVersion={data.profileImgVersion}
                />
                <p>{data.username}</p>
              </button>
            ))
          ) : (
            <div className="empty__search">
              <p>Hmmm.... No users were found.</p>
            </div>
          )}
        </div>
        <div className="search__section--wrapper searchbar__search--all--container">
          <button
            id="search__search--all"
            onClick={() => {
              if (searchContent != "") {
                window.location.href = `${window.location.origin}/search/${searchContent}/${token}`;
              } else {
                window.location.href = `${window.location.origin}/search/""/${token}`;
              }
            }}
          >
            <i className="fa-solid fa-search"></i>
            <h4>Search for {searchContent}</h4>
          </button>
        </div>
      </div>
    </>
  );
};

const Search = () => {
  const [active, setActive] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<string>("");
  const { darkActive, mobileMedia } = useContext<GlobalContext>(UserContext);
  const [mobileSearchbar, setMobileSearchbar] = useState<boolean>(false);
  const onFocus = () => setActive(!false);
  const onBlur = () => {
    setTimeout(() => {
      setActive(false);
    }, 100);
  };

  const hanldeSearchSubmit = () => {
    console.log(searchContent);

    // if (searchContent != "") {
    //   window.location.href = `${window.location.origin}/search/${searchContent}/${token}`;
    // }
  };

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [[], active]);

  useEffect(() => {
    if (mobileSearchbar == !false) {
      document
        .querySelector(`.search__container`)
        ?.setAttribute(`style`, "position: absolute; left: 0; width: 100%");
    } else {
      document
        .querySelector(`.search__container`)
        ?.setAttribute(`style`, "position: inherit)");
    }
  }, [mobileSearchbar]);

  return (
    <>
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          hanldeSearchSubmit();
        }}
        className="search__container"
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {mobileMedia == false ? (
          <input
            className="searchbar"
            placeholder="Search"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                hanldeSearchSubmit();
              }
            }}
            onChange={(e) => {
              setSearchContent(e.currentTarget.value);
            }}
            value={searchContent}
          ></input>
        ) : null}
        {mobileSearchbar == !false ? (
          <div className="mobile__searchbar--container">
            <input
              className="mobile__searchbar"
              placeholder="Search"
              onChange={(e) => {
                setSearchContent(e.currentTarget.value);
              }}
              value={searchContent}
              style={
                darkActive == !false
                  ? {
                      background: "var(--hover-on-black-DM)",
                      color: "var(--white-DM)",
                    }
                  : undefined
              }
            ></input>
            <Button
              content="fa-solid fa-xmark"
              icon={!false}
              inactive={!false}
              action={setMobileSearchbar}
              secondAction={setActive}
              secondOptionalValue={false}
              optionalValue={false}
            />
          </div>
        ) : null}

        {active == !false && searchContent.length > 0 ? (
          <SearchDropdown searchContent={searchContent} />
        ) : null}
      </form>
      {mobileMedia == !false ? (
        <button
          className="mobile__search--icon"
          onClick={() => setMobileSearchbar(!false)}
        >
          <i className="fa-solid fa-search"></i>
        </button>
      ) : null}
    </>
  );
};
export default Search;
