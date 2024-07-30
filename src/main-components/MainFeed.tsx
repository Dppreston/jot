import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import FeedPostTile from "../post-components/FeedPostTile";
import categories from "../staticdata/Categories";
import TileLoader from "../loaders/TileLoader";
import BottomReached from "../secondary-components/BottomReached";
import FeedSort from "../sort-components/FeedSort";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import { GlobalContext, UserContext } from "../App";

const token: string | null = localStorage.getItem("token");

type SelectedCategory = {
  selectedCategory: string;
};

type PostData = {
  id: string;
  category: string;
  creationDate: string;
  headline: string;
  postBody: string;
  title: string;
  userId: string;
  likes: number;
  dislikes: number;
  likedUsers: string[];
  dislikedsUsers: string[];
  savedUsers: string[];
  postImg: string;
  postImgVersion: number;
};

const MainFeed = ({ selectedCategory }: SelectedCategory) => {
  const [postData, setPostData] = useState<PostData[]>();
  const scrollRef = useRef<any>();
  const [inView, setInView] = useState<boolean>(false);
  const [dynamicLength, setDynamicLength] = useState<number>();
  const [maxPosts, setMaxPost] = useState<boolean>(false);
  const [transferForYou, setTranferForYou] = useState<string[]>();
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const [sort, setSort] = useState<number>(1);
  const { loggedin } = useContext<GlobalContext>(UserContext);
  const topRef: React.MutableRefObject<any> = useRef();

  //category FETCH && sort

  const categorySelection = async () => {
    try {
      const res = await axios.get(
        `/jot-posts/?homeCategory=true&categorySelection=${selectedCategory}&sortOption=${sort}`
      );

      if (res.data) {
        setDynamicLength(res.data.length);
        setPostData(res.data);
      }

      const allPostLength = await axios.get(
        `/jot-posts?loaderCheck=true&selectedCategory=${selectedCategory}`
      );

      if (allPostLength.data == res.data.length) {
        setTimeout(() => {
          setMaxPost(false);
        }, 100);
      }
      if (allPostLength.data.length != res.data.length) {
        setMaxPost(!false);
      }
    } catch (err) {
      console.log(err);
    }
    return;
  };

  //dynamic loading && sort

  const dynamicLoading = async () => {
    try {
      const fetchFollowers = await axios.get(
        `/jot-users?followers=true&userId=${token}`
      );

      const res = await axios.get(
        `/jot-posts?loadPosts=true&categorySelection=${selectedCategory}&inView=${inView}&length=${dynamicLength}&forYouTransfer=${transferForYou}&sortOption=${sort}&followers=${fetchFollowers.data[0].followers}`
      );

      if (res.data) {
        setPostData(res.data);
        setDynamicLength(res.data.length);
        setPostData(res.data);
      }

      //all category posts reference

      const allPostLength = await axios.get(
        `/jot-posts?loaderCheck=true&selectedCategory=${selectedCategory}&forYouTransfer=${transferForYou}&followers=${fetchFollowers.data[0].followers}`
      );

      if (allPostLength.data == dynamicLength) {
        setMaxPost(false);

        if (allPostLength.data > 10 && allPostLength.data == dynamicLength) {
          setBottomReached(!false);
        } else {
          setBottomReached(false);
        }
      }
      if (allPostLength.data != dynamicLength) {
        setMaxPost(!false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //logged out dynamic loading && sort

  const guestLoading = async () => {
    const res = await axios.get(
      `/jot-posts?guestLoadPosts=true&categorySelection=${selectedCategory}&inView=${inView}&length=${dynamicLength}&sortOption=${sort}`
    );

    if (res.data) {
      setPostData(res.data);
      setDynamicLength(res.data.length);
      setPostData(res.data);
    }

    //all category posts reference

    const allPostLength = await axios.get(
      `/jot-posts?guestLoaderCheck=true&selectedCategory=${selectedCategory}`
    );

    if (allPostLength.data == dynamicLength) {
      setMaxPost(false);
      if (allPostLength.data.length > 10) {
        setBottomReached(!false);
      } else {
        setBottomReached(false);
      }
    } else {
      setMaxPost(!false);
    }
  };

  //just for you && sort

  const justForYou = async () => {
    try {
      const fetchUserFavorites = await axios.get(
        `/jot-users?homeFavorites=true&userId=${token}`
      );

      const fetchFollowers = await axios.get(
        `/jot-users?followers=true&userId=${token}`
      );

      //category titles match

      if (fetchUserFavorites.data) {
        const favoritesArr: number[] =
          fetchUserFavorites.data[0].favoriteCategories;
        const matched = categories.filter((all) =>
          favoritesArr!?.includes(all.id)
        );
        if (matched) {
          const matchedTitles = matched?.map((data) => {
            return data.title;
          });

          if (matchedTitles) {
            const forYouPosts = await axios.get(
              `/jot-posts?justForYou=true&titles=${matchedTitles}&sortOption=${sort}&followers=${fetchFollowers.data[0].followers}`
            );

            setPostData(forYouPosts.data);
            setDynamicLength(forYouPosts.data.length);
            setTranferForYou(matchedTitles);
          }
        }
      }
    } catch (err) {}
  };

  //sort option

  const sortOption = (selection: number) => {
    setSort(selection);
  };

  //load element in view

  const isInView = () => {
    if (scrollRef.current != undefined) {
      const rect = scrollRef.current.getBoundingClientRect();
      setTimeout(() => {
        setInView(rect.top < window.innerHeight && rect.bottom >= 0);
      }, 100);
    }
  };

  //back to top

  const handleBottomClick = (clicked: boolean) => {
    if (clicked == true) {
      scrollToTop();
    }
  };

  //scroll to top

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "instant" });
    categorySelection();
  };

  //useEffects

  useEffect(() => {
    isInView();
  }, [postData]);

  useEffect(() => {
    window.loginCheck(token);
    document.addEventListener("scroll", isInView);
    return () => {
      document.removeEventListener("scroll", isInView);
    };
  }, []);

  useEffect(() => {
    if (inView == true && loggedin == !false) {
      dynamicLoading();
    }
    if (inView == true && loggedin == false) {
      guestLoading();
    }
  }, [inView]);

  useEffect(() => {
    scrollToTop();
    sortOption(1);

    if (selectedCategory == "just for you") {
      justForYou();
    }
    setBottomReached(false);
    window.history.pushState(
      "",
      "",
      `/home/${loggedin == !false ? token : ""}
   
      `
    );
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory == "just for you") {
      justForYou();
    }
    categorySelection();
  }, [sort]);

  return (
    <>
      <div className="bottom__reached--wrapper">
        <div
          className="top__ref--container"
          ref={topRef}
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translate(-50%)",
          }}
        ></div>

        <div className="main__feed--wrapper">
          <div className="feed__sort--wrapper">
            {postData != undefined ? (
              <FeedSort
                sortOption={sortOption}
                selectedCategory={selectedCategory}
                userPosts={false}
              />
            ) : null}
          </div>
          {postData != undefined && postData!.length > 0 ? (
            postData?.map((userPostData, key) => (
              <FeedPostTile userPostData={userPostData} key={key} />
            ))
          ) : (
            <EmptyContent data={emptyData[0]} />
          )}
        </div>
        {maxPosts == !false ? (
          <TileLoader scrollRef={scrollRef} inView={inView} />
        ) : null}
        {bottomReached == !false ? (
          <BottomReached handleBottomClick={handleBottomClick} />
        ) : null}
      </div>
    </>
  );
};
export default MainFeed;
