import DashboardProfile from "../profile-components/DashboardProfile";
import Navbar from "../main-components/Navbar";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import FeedPostTile from "../post-components/FeedPostTile";
import TileLoader from "../loaders/TileLoader";
import BottomReached from "../secondary-components/BottomReached";
import UserProfileTile from "../profile-components/UserProfileCard";
import {
  ProfileSettings,
  AccountSettings,
  Preferences,
} from "../main-components/Settings";
import { GlobalContext, UserContext } from "../App";
import FollowerFollowing from "../popup-components/FollowerFollowing";

const token: string | null = localStorage.getItem("token");

let profileSetingsOptions: {
  id: number;
  option: string;
  icon: string;
  selected: boolean;
}[] = [
  {
    id: 1,
    option: "Posts",
    icon: "fa-solid fa-pencil",
    selected: !false,
  },
  {
    id: 2,
    option: "Saved Posts",
    icon: "fa-solid fa-bookmark",
    selected: false,
  },
  {
    id: 3,
    option: "Posts You've Liked",
    icon: "fa-regular fa-thumbs-up",
    selected: false,
  },
  {
    id: 4,
    option: "Posts You've Disliked",
    icon: "fa-regular fa-thumbs-down",
    selected: false,
  },
  {
    id: 10,
    option: "Settings",
    icon: "fa-solid fa-sliders",
    selected: false,
  },
];

const settingsOptions: { id: number; title: string; icon: string }[] = [
  {
    id: 1,
    title: "Profile Settings",
    icon: "fa-regular fa-user",
  },
  {
    id: 2,
    title: "Account Settings",
    icon: "fa-solid fa-gear",
  },
  {
    id: 3,
    title: "Preferences",
    icon: "fa-solid fa-bars",
  },
];

type UserPostData = {
  id: string;
  category: string;
  creationDate: string;
  headline: string;
  postBody: string;
  title: string;
  userId: string;
  likes: number;
  dislikes: number;
  likedUsers: any;
  dislikedsUsers: any;
};

type UserData = {
  _id: string;
  username: string;
  creationDate: Date;
  savedPosts: string[];
  profilePicture: string;
  favoriteCategories: number[];
  bio: string;
  private: boolean;
  profileImgVersion: number;
};

type ProfileSettingsData = {
  _id: string;
  bio: string;
  favoriteCategories: number[];
  username: string;
  profileImgVersion: number;
  profilePicture: string;
};

type AccountData = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type PreferenceData = {
  _id: string;
  parentUserId: string;
  darkMode: boolean;
  privateProfile: boolean;
};

type MobileProps = {
  menuDetection: (selection: number) => void;
  mobileMenuDetection: (selection: Element) => void;
};

const MobileDashboardMenu = ({
  menuDetection,
  mobileMenuDetection,
}: MobileProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  return (
    <>
      <div className="mobile__dashboard--menu--container">
        <button
          onClick={(e) => {
            menuDetection(5);
            mobileMenuDetection(e.currentTarget);
          }}
        >
          <i
            className="fa-solid fa-user"
            style={
              darkActive == !false ? { color: "var(--white-DM)" } : undefined
            }
          ></i>
        </button>
        {profileSetingsOptions.map((data) => (
          <button
            key={data.id}
            onClick={(e) => {
              menuDetection(data.id);
              mobileMenuDetection(e.currentTarget);
            }}
          >
            <i
              className={data.icon}
              style={
                darkActive == !false ? { color: "var(--white-DM)" } : undefined
              }
            ></i>
          </button>
        ))}
      </div>
    </>
  );
};

const UserDashboard = () => {
  const [menuSelection, setMenuSelection] = useState<number>(5);
  const [userPostData, setUserPostData] = useState<
    UserPostData[] | undefined
  >();
  const [userData, setUserData] = useState<UserData[]>();
  const [bottomReached, setBottomReached] = useState<boolean>(false);
  const topRef: React.MutableRefObject<any> = useRef();
  const scrollRef = useRef<any>();
  const [inView, setInView] = useState<boolean>(false);
  const [maxPosts, setMaxPost] = useState<boolean>(false);
  const [dynamicLength, setDynamicLength] = useState<number>();
  const [maxLength, setMaxLength] = useState<number>();
  const [memberSince, setMemberSince] = useState<string>("");
  const [settingsSelection, setSettingsSelection] = useState<number>(1);
  const [accountData, setAccountData] = useState<AccountData[]>();
  const [preferenceData, setPreferenceData] = useState<PreferenceData[]>();
  const [profileSettingsData, setProfileSettingsData] =
    useState<ProfileSettingsData[]>();
  const [ffAction, setFFAction] = useState<number>();
  const { darkActive, mobileMedia } = useContext<GlobalContext>(UserContext);

  const menuDetection = (selection: number) => {
    setMenuSelection(selection);
  };

  //fetch all categories on click

  const fetchCats = async () => {
    try {
      const res = await axios.get(
        `/jot-posts?allSelection=true&userSelection=${menuSelection}&userId=${token}`
      );

      setUserPostData(res.data[0]);
      setDynamicLength(res.data[0].length);
      setMaxLength(res.data[1].length);

      if (res.data[1].length == res.data[0].length) {
        setMaxPost(false);
      }

      if (res.data[1].length != res.data[0].length) {
        setMaxPost(!false);
      }
    } catch (err) {}
  };

  //fetch user

  const fetchDashboardUser = async () => {
    try {
      const res = await axios.get(`/jot-users?dashboard=true&userId=${token}`);
      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //fetch profile settings

  const fetchProfileSettings = async () => {
    const res = await axios.get(`/jot-users?profileSet=true&userId=${token}`);

    setProfileSettingsData(res.data);
  };

  //fetch account settings

  const fetchAccountSettings = async () => {
    const res = await axios.get(
      `/jot-user-sensitive?userSens=true&userId=${token}`
    );
    setAccountData(res.data);
  };

  const fetchPreferences = async () => {
    const res = await axios.get(
      `/jot-user-preferences?userPreferences=true&userId=${token}`
    );
    setPreferenceData(res.data);
  };

  //dynamic scroll loading

  const dynamicLoading = async () => {
    try {
      const res = await axios.get(
        `/jot-posts?userLoader=true&userSelection=${menuSelection}&inView=${inView}&userLength=${dynamicLength}&userId=${token}`
      );
      setUserPostData(res.data);

      if (res.data) {
        setDynamicLength(res.data.length);
      }

      if (maxLength == res.data.length) {
        setMaxPost(false);
        if (maxLength! >= 8) {
          setBottomReached(!false);
        } else {
          setBottomReached(false);
        }
      }
      if (maxLength == undefined) {
        setBottomReached(false);
      }

      if (maxLength! != res.data.length) {
        setMaxPost(!false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //back to top // scrolling

  const handleBottomClick = (clicked: boolean) => {
    if (clicked == true) {
      scroll();
    }
  };

  const scroll = () => {
    const scroll = topRef.current.scrollIntoView({ behavior: "instant" });
    return scroll;
  };

  const waitScroll = async () => {
    await scroll();
    fetchCats();
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

  //date joined

  const dateJoined = () => {
    const dateJoined = new Date(userData![0].creationDate).toLocaleDateString();
    setMemberSince(dateJoined);
  };

  const followerFollowingPopupDetection = (res: number) => {
    setFFAction(res);
  };

  // SETTINGS

  //button selection

  const settingsMenuSelection = (element: Element) => {
    //desktop

    const list = document
      .querySelector(".user__settings--wrapper")
      ?.getElementsByTagName("button");

    for (let i = 0; i < list!.length; i++) {
      list![i].classList.remove("button__selected");
    }
    element.classList.add("button__selected");
  };

  const mobileMenuSelection = (element: Element) => {
    //mobile
    const mobileList = document
      .querySelector(`.mobile__dashboard--menu--container`)
      ?.getElementsByTagName("button");

    for (let i = 0; i < mobileList!.length; i++) {
      mobileList![i].style.background = "none";
    }

    element.setAttribute("style", "background: var(--hover-DM)");
  };

  //use effects

  useEffect(() => {
    if (userData != undefined) {
      dateJoined();
    }
  }, [userData]);

  useEffect(() => {
    if (inView == true) {
      dynamicLoading();
    }
  }, [inView && dynamicLength]);

  useEffect(() => {
    //fetch user
    fetchDashboardUser();
    fetchPreferences();

    document.addEventListener("scroll", isInView);
    return () => {
      document.removeEventListener("scroll", isInView);
    };
  }, []);

  useEffect(() => {
    isInView();
  }, [userPostData]);

  useEffect(() => {
    if (menuSelection == 10) {
      // initial settings pick
      setSettingsSelection(1);

      //first button selection

      let first = document.querySelector(".settings__option");
      first?.classList.add("button__selected");

      const mobileSettingsFirst = document
        .querySelector(`.mobile__settings--nav`)
        ?.getElementsByTagName("button")[0];

      mobileSettingsFirst?.classList.add("button__selected");
    }
    waitScroll();
  }, [menuSelection]);

  //settings selection

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
    if (settingsSelection == 1) {
      fetchProfileSettings();
      darkActive == !false ? window.darkMode() : null;
    }
    if (settingsSelection == 2) {
      fetchAccountSettings();
      darkActive == !false ? window.darkMode() : null;
    }
    if (settingsSelection == 3) {
      fetchPreferences();
      darkActive == !false ? window.darkMode() : null;
    }
  }, [settingsSelection]);

  //mobile menu detection

  useEffect(() => {
    if (mobileMedia == !false) {
      //first mobile selection

      const mobileFirst = document
        .querySelector(`.mobile__dashboard--menu--container`)
        ?.getElementsByTagName("button")[0];

      mobileFirst?.setAttribute("style", "background: var(--hover-DM)");
    }
  }, [mobileMedia]);

  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper">
          <div className="bottom__reached--wrapper">
            <div
              className="top__ref--container"
              ref={topRef}
              style={{
                position: "absolute",
                top: "-75px",
              }}
            ></div>
            <div className="site__column--wrapper">
              {mobileMedia == !false ? (
                <MobileDashboardMenu
                  menuDetection={menuDetection}
                  mobileMenuDetection={mobileMenuSelection}
                />
              ) : null}
              {menuSelection == 5 && userData != undefined ? (
                <UserProfileTile
                  userData={userData[0]}
                  memberSince={memberSince}
                  master={true}
                  privateProfile={false}
                  ffAction={followerFollowingPopupDetection}
                />
              ) : null}

              {menuSelection != 10 ? (
                userPostData?.map((postData, key) => (
                  <FeedPostTile userPostData={postData} key={key} />
                ))
              ) : (
                <div className="user__settings--wrapper">
                  {mobileMedia == false ? (
                    <div className="user__settings--left">
                      {settingsOptions.map((data) => (
                        <button
                          className="settings__option"
                          key={data.id}
                          onClick={(e) => {
                            e.preventDefault();
                            settingsMenuSelection(e.currentTarget);
                            setSettingsSelection(data.id);
                          }}
                        >
                          <i className={data.icon}></i> <h4>{data.title}</h4>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {mobileMedia == !false ? (
                    <div className="mobile__settings--nav">
                      {settingsOptions.map((data) => (
                        <button
                          key={data.id}
                          onClick={(e) => {
                            e.preventDefault();
                            settingsMenuSelection(e.currentTarget);
                            setSettingsSelection(data.id);
                          }}
                        >
                          <i
                            className={data.icon}
                            style={
                              darkActive == !false
                                ? { color: "var(--white-DM)" }
                                : undefined
                            }
                          ></i>
                        </button>
                      ))}
                      {settingsOptions
                        .filter((el) => el.id == settingsSelection)
                        .map((data) => (
                          <h3 key={data.id}>{data.title}</h3>
                        ))}
                    </div>
                  ) : null}

                  <div className="user__settings--right">
                    {settingsSelection == 1 &&
                    profileSettingsData != undefined ? (
                      <ProfileSettings
                        selection={settingsSelection}
                        profileSettingsData={profileSettingsData[0]}
                        preferenceData={preferenceData![0]}
                      />
                    ) : null}
                    {settingsSelection == 2 && accountData != undefined ? (
                      <AccountSettings
                        selection={settingsSelection}
                        accountData={accountData[0]}
                        username={userData![0]?.username}
                      />
                    ) : null}
                    {settingsSelection == 3 && preferenceData != undefined ? (
                      <Preferences
                        selection={settingsSelection}
                        preferenceData={preferenceData[0]}
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            {maxPosts == !false && menuSelection != 10 && menuSelection != 5 ? (
              <TileLoader scrollRef={scrollRef} inView={inView} />
            ) : null}
            {bottomReached == !false &&
            userPostData!?.length > 3 &&
            menuSelection != 5 ? (
              <BottomReached handleBottomClick={handleBottomClick} />
            ) : null}
          </div>
          {mobileMedia == false ? (
            <div className="site__column--wrapper">
              <DashboardProfile
                profileOptions={profileSetingsOptions}
                menuDetection={menuDetection}
                profilePic={userData ? userData[0].profilePicture : undefined}
                username={userData ? userData[0].username : undefined}
                imgVersion={
                  userData ? userData![0]?.profileImgVersion : undefined
                }
                memberSince={memberSince}
              />
            </div>
          ) : null}
        </div>
      </div>
      {ffAction != undefined ? (
        <FollowerFollowing
          action={ffAction}
          close={setFFAction}
          userId={userData![0]?._id}
        />
      ) : null}
    </>
  );
};
export default UserDashboard;
