import { useParams } from "react-router";
import { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../main-components/Navbar";
import FeedPostTile from "../post-components/FeedPostTile";
import axios from "axios";
import TileLoader from "../loaders/TileLoader";
import BottomReached from "../secondary-components/BottomReached";
import FeedSort from "../sort-components/FeedSort";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import ProfileSideTile from "../side-components/ProfileSideTile";
import { GlobalContext, UserContext } from "../App";

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
};

const UserPosts = () => {
  const { userId, username, profilePicCheck } = useParams();
  const [postData, setPostData] = useState<PostData[]>();
  const [inView, setInView] = useState<boolean>(false);
  const [maxPosts, setMaxPost] = useState<boolean>(false);
  const [dynamicLength, setDynamicLength] = useState<number>();
  const [maxLength, setMaxLength] = useState<number>();
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>();
  const topRef: React.MutableRefObject<any> = useRef();
  const scrollRef = useRef<any>();
  const [sort, setSort] = useState<number>(1);
  const [categorySort, setCategorySort] = useState<string>("");
  const [memberSince, setMemberSince] = useState<string>("");
  const [profileImgVersion, setProfileImgVersion] = useState<number>();
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  //fetch specific user posts && filter

  const fetchUserPosts = async () => {
    try {
      //limited post fetch && full length

      const res = await axios.get(
        `http://localhost:1000/jot-posts?specificUserPosts=true&userId=${userId}&sortOption=${sort}&categorySort=${categorySort}`
      );

      if (res.data != null) {
        setPostData(res.data[0]);
        setDynamicLength(res.data[0].length);
        setMaxLength(res.data[1]);

        if (res.data[1].length == res.data[0].length) {
          setMaxPost(false);
        }

        if (res.data[1].length != res.data[0].length) {
          setMaxPost(!false);
        }
      } else {
        setPostData(undefined);
        window.location.href = `${window.location.origin}/error/${userId}/404`;
      }
    } catch (err) {
      console.log(err);
    }
  };

  //dynamic scroll loading

  const dynamicLoading = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-posts?specificUserLoader=true&inView=${inView}&userLength=${dynamicLength}&userId=${userId}&currentCategory=${categorySort}&sortOption=${sort}`
      );
      setPostData(res.data);

      if (res.data) {
        setDynamicLength(res.data.length);
      }

      if (maxLength == res.data.length) {
        setMaxPost(false);
        if (maxLength! > 10) {
          setBottomReached(!false);
        } else {
          setBottomReached(false);
        }
      }
      if (maxLength == undefined) {
        setBottomReached(false);
      }

      if (maxLength! != res.data.length) {
        console.log(maxLength);

        setMaxPost(!false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //back to top // scrolling

  const handleBottomClick = (clicked: boolean) => {
    if ((clicked = true)) {
      scroll();
    }
  };

  const scroll = () => {
    const scroll = topRef.current.scrollIntoView();
    return scroll;
  };

  //in view check

  const isInView = () => {
    if (scrollRef.current != undefined) {
      const rect = scrollRef.current.getBoundingClientRect();
      setTimeout(() => {
        setInView(rect.top < window.innerHeight && rect.bottom >= 0);
      }, 200);
    }
  };

  //sort option

  const sortOption = (selection: number) => {
    setSort(selection);
  };

  //category sort

  const categorySortSelection = (result: string) => {
    setCategorySort(result);
  };

  //date joined

  const fetchUserCreationDate = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?memberSince=true&userId=${userId}`
    );
    if (res.data) {
      const memberMonth = new Date(res.data![0]?.creationDate)
        .getMonth()
        .toString();
      const memberDay = new Date(res.data![0]?.creationDate)
        .getDate()
        .toString();
      const memberYear = new Date(res.data![0]?.creationDate)
        .getFullYear()
        .toString();

      setMemberSince(`${memberMonth}/${memberDay}/${memberYear}`);
    }
  };

  //fetch img details

  const fetchImgDetails = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?imgDetails=true&userId=${userId}`
    );
    setProfilePic(res.data[0].profilePicture);
    setProfileImgVersion(res.data[0].profileImgVersion);
  };

  //sort fetch

  useEffect(() => {
    fetchUserPosts();
  }, [sort]);
  useEffect(() => {
    fetchUserPosts();
  }, [categorySort]);

  useEffect(() => {
    // fetchProfilPic();
    fetchImgDetails();
    fetchUserCreationDate();
  }, [username, userId]);

  //initial fetch and dynamic loading

  useEffect(() => {
    fetchUserPosts();
    document.addEventListener("scroll", isInView);
    return () => {
      document.removeEventListener("scroll", isInView);
    };
  }, []);

  useEffect(() => {
    isInView();
  }, [postData]);

  useEffect(() => {
    if (inView == true) {
      dynamicLoading();
    }
  }, [inView && dynamicLength]);
  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper">
          <div className="site__column--wrapper">
            {mobileMedia == !false ? (
              <ProfileSideTile
                username={username}
                profilePic={profilePic}
                userId={userId}
                memberSince={memberSince}
                imgVersion={profileImgVersion}
                button={true}
              />
            ) : null}

            <div
              className="top__ref--container"
              ref={topRef}
              style={{
                position: "absolute",
                top: "-75px",
              }}
            ></div>

            <FeedSort
              sortOption={sortOption}
              userPosts={true}
              categorySortSelection={categorySortSelection}
            />
            {postData != undefined && postData.length > 0
              ? postData.map((data, key) => (
                  <FeedPostTile userPostData={data} key={key} />
                ))
              : emptyData
                  .filter((data) => data.id == 6)
                  .map((data) => <EmptyContent data={data} key={data.id} />)}
          </div>
          {maxPosts == !false && postData!.length > 3 ? (
            <TileLoader scrollRef={scrollRef} inView={inView} />
          ) : null}
          {bottomReached == !false && postData!?.length > 3 ? (
            <BottomReached handleBottomClick={handleBottomClick} />
          ) : null}
        </div>
        {mobileMedia == false ? (
          <div className="site__column--wrapper">
            <ProfileSideTile
              username={username}
              profilePic={profilePic}
              userId={userId}
              memberSince={memberSince}
              imgVersion={profileImgVersion}
              button={true}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
export default UserPosts;
