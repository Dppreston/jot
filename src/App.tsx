import "./css-files/App.css";
import "./css-files/Media.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/landing-pages/Home";
import Login from "./main-components/Login";
import UserDashboard from "./landing-pages/UserDashboard";
import Post from "./landing-pages/Post";
import React, { useEffect, useState } from "react";
import UserProfile from "./landing-pages/UserProfile";
import UserPosts from "./landing-pages/UserPosts";
import SearchAll from "./landing-pages/SearchAll";
import axios from "axios";
import CreatePost from "./post-components/CreatePost";
import ConfirmPopup from "./popup-components/ConfirmPopup";
import Messages from "./landing-pages/Messages";
import "react-lazy-load-image-component/src/effects/blur.css";
import Error from "./landing-pages/Error";
import Report from "./popup-components/Report";
import Info from "./landing-pages/Info";
import PasswordRecovery from "./secondary-components/PasswordRecovery";
import EditBio from "./popup-components/EditBio";
import UpdateFavorites from "./popup-components/UpdateFavorites";

export const UserContext: any = React.createContext(null);

const token: string | null = localStorage.getItem(`token`);

//global functions

declare global {
  interface Window {
    themeCheck: any;
    darkMode: Function;
    loginCheck: Function;
    recommendedUsers: Function;
    fetchSingleProfilePic: Function;
    notificationCheck: Function;
    followRequestAlert: Function;
    globalUserMessageCheck: Function;
    selectedConvoFetch: Function;
    messageRead: Function;
    handleNotification: Function;
    mediaChange: Function;
    fetchComments: Function;
  }
}

//global context

export type GlobalContext = {
  darkActive: boolean;
  loggedin: boolean;
  setLoggedin: Function;
  loginActive: boolean;
  setLoginActive: Function;
  signup: boolean;
  setSignup: Function;
  userSuggestions: {
    _id: string;
    username: string;
    password: string;
    lastName: string;
    firstName: string;
    email: string;
    creationDate: Date;
    savedPosts: string[];
    profilePicture: string;
    favoriteCategories: number[];
    bio: string;
    profileImgVersion: number;
  }[];
  readCount: number;
  setReadCount: Function;
  page: number;
  setPage: Function;
  followRequestAlerts:
    | {
        _id: string | undefined;
        username: string | undefined;
      }[]
    | undefined;
  setFollowRequestAlerts: Function;
  confirmActive: boolean;
  setConfirmActive: Function;
  createActive: boolean;
  setCreateActive: Function;
  confirmConditions: Object;
  setConfirmConditions: Function;
  content: string;
  confirmAction: Function;
  secondAction: Function;
  secondOptionalValue?: boolean;
  messageRead: boolean;
  setMessageRead: Function;
  notificationResType: string;
  setNotificationResType: Function;
  reportActive: boolean;
  setReportActive: Function;
  reportConditions: Object;
  setReportConditions: Function;
  reportType: string;
  reportReferenceId: string | number;
  mobileMedia: boolean;
  setMobileMedia: Function;
  mobileTextLimit: number;
  setMobileTextLimit: Function;
  passwordRecovery: boolean;
  setPasswordRecovery: Function;
  setBioActive: Function;
  bioActive: boolean;
  setExistingBio: Function;
  existingBio: string | undefined;
  setChangeFavoritesActive: Function;
  changeFavoritesActive: boolean;
  setUserFavoritesForUpdate: Function;
  userFavoritesForUpdate: number[];
};

//message data type

export type MessageData = {
  messageData: {
    _id: string;
    users: string[];
    deletedUsers: string[];
    messages: {
      _id: number;
      content: string;
      sender: string;
      receiver: string;
      creationDate: Date;
      likedUsers: string[];
      dislikedUsers: string[];
    }[];
    creationDate: Date;
    unreadUsers: string[];
  }[];
};

export type NotificationData = {
  referenceId: string;
  referenceUserId: string;
  username?: string;
  actionUserId: string;
  type: string;
};

function App() {
  let mobile = window.matchMedia("(max-width: 950px)");
  mobile.addEventListener("change", () => window.mediaChange(mobile));

  const [darkActive, setDarkActive] = useState<GlobalContext>();
  const [loggedin, setLoggedin] = useState<GlobalContext | boolean>();
  const [loginActive, setLoginActive] = useState<GlobalContext | boolean>();
  const [userSuggestions, setUserSuggestions] = useState<GlobalContext>();
  const [readCount, setReadCount] = useState<GlobalContext>();
  const [signup, setSignup] = useState<GlobalContext | boolean>(false);
  const [page, setPage] = useState<GlobalContext | number>(0);
  const [followRequestAlerts, setFollowRequestAlerts] = useState<
    GlobalContext | string[]
  >();
  const [createActive, setCreateActive] = useState<GlobalContext | boolean>(
    false
  );
  const [confirmActive, setConfirmActive] = useState<GlobalContext | boolean>(
    false
  );
  const [confirmConditions, setConfirmConditions] = useState<GlobalContext>();
  const [messageData, setMessageData] = useState<MessageData[]>();
  const [messageRead, setMessageRead] = useState<GlobalContext>();
  const [notificationResType, setNotificationResType] =
    useState<GlobalContext>();

  const [reportActive, setReportActive] = useState<GlobalContext | boolean>(
    false
  );
  const [reportConditions, setReportConditions] = useState<GlobalContext>();
  const [mobileMedia, setMobileMedia] = useState<GlobalContext | boolean>(
    mobile.matches
  );
  const [mobileTextLimit, setMobileTextLimit] = useState<
    GlobalContext | number
  >(900 / 15);
  const [passwordRecovery, setPasswordRecovery] = useState<
    boolean | GlobalContext
  >(false);
  const [bioActive, setBioActive] = useState<boolean | GlobalContext>(false);
  const [existingBio, setExistingBio] = useState<GlobalContext>();
  const [changeFavoritesActive, setChangeFavoritesActive] = useState<
    GlobalContext | boolean
  >(false);
  const [userFavoritesForUpdate, setUserFavoritesForUpdate] =
    useState<GlobalContext>();

  //dark mode options

  const darkModeOptions: {
    id: number;
    selector: string;
    type: string;
    style: string;
    method: string;
  }[] = [
    {
      id: 1,
      selector: ".site__wrapper",
      type: "background",
      style: "var(--black-DM)",
      method: "query",
    },
    {
      id: 2,
      selector: ".help__container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 3,
      selector: ".feed__sort--dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 4,
      selector: ".feed__category--sort--dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 5,
      selector: ".feed__tile",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 6,
      selector: ".feed__sort--container",
      type: "border-bottom",
      style: "var(--border-DM)",
      method: "query",
    },
    {
      id: 7,
      selector: ".comment__sorting--container",
      type: "border-bottom",
      style: "var(--border-on-hover-DM)",
      method: "query",
    },
    {
      id: 8,
      selector: ".dashboard__profile ",
      type: "border-bottom",
      style: "var(--border-DM)",
      method: "query",
    },
    {
      id: 9,
      selector: ".sort__dropdown--btn",
      type: "border-right",
      style: "var(--border-on-hover-DM)",
      method: "query",
    },
    {
      id: 10,
      selector: ".create__post--inner",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 11,
      selector: ".post__img--upload--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 12,
      selector: ".post__img--upload--preview--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },

    {
      id: 13,
      selector: ".post__category--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },

    {
      id: 14,
      selector: ".create__style--wrapper input",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 15,
      selector: "#post__content--label textarea",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 16,
      selector: ".tile__fade",
      type: "background",
      style: `linear-gradient(
        to bottom,
        transparent 5%,
        rgba(56, 53, 54, 0.8) 50%,
        rgba(56, 53, 54, 1) 100%
      ); !important`,
      method: "query",
    },
    {
      id: 17,
      selector: ".post__img--preview--blur",
      type: "background",
      style: `linear-gradient(
        to bottom,
        transparent 5%,
        rgba(56, 53, 54, 0.8) 50%,
        rgba(56, 53, 54, 1) 100%
      ); !important`,
      method: "query",
    },
    {
      id: 18,
      selector: ".post__top--wrapper",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 19,
      selector: ".post__interactions",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 20,
      selector: ".post__display",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 21,
      selector: ".post__creation--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 22,
      selector: ".share__dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 23,
      selector: ".option__dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },

    {
      id: 25,
      selector: ".top__creation--container i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 19,
      selector: ".post__category--tile i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 26,
      selector: ".post__category--tile ",
      type: "background",
      style: "var(--accent); !important",
      method: "query",
    },
    {
      id: 27,
      selector: ".comments__wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 28,
      selector: ".sort__dropdown--menu",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 29,
      selector: ".comment__dropdown",
      type: "background",
      style: "var(--hover-on-black-DM); !important",
      method: "query",
    },
    {
      id: 30,
      selector: "#comment__reply",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 31,
      selector: ".reply__submit--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 32,
      selector: ".create__comment--wrapper",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 33,
      selector: "#comment__input",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 34,
      selector: "#comment__reply--button",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 35,
      selector: ".comment__dropdown--selection",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 36,
      selector: ".navbar__dropdown--wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },

    {
      id: 38,
      selector: ".home__nav--dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },

    {
      id: 40,
      selector: ".notification__dropdown--wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 41,
      selector: ".info__bubble",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 42,
      selector: ".navbar__outer",
      type: "background",
      style: "var(--black-DM)",
      method: "query",
    },
    {
      id: 43,
      selector: ".navbar__outer i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 44,
      selector: ".searchbar",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 45,
      selector: ".search__dropdown",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 46,
      selector: ".search__summary--bar",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 47,
      selector: ".search__all--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 48,
      selector: ".search__all--user--tile",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 49,
      selector: ".search__tile",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 50,
      selector: ".profile__wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 51,
      selector: ".profile__card--wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 52,
      selector: ".user__settings--wrapper",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 53,
      selector: ".user__info--style",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },

    {
      id: 54,
      selector: "#update__bio",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 55,
      selector: ".current__favorites--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 56,
      selector: ".unselected__category--container",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 57,
      selector: ".info__popup",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 58,
      selector: ".nav__category--tile i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 59,
      selector: ".settings__option i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 60,
      selector: ".update__bio--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 61,
      selector: ".update__favorites--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 62,
      selector: ".favorites__tile",
      type: "background",
      style: "var(--accent)",
      method: "query",
    },

    {
      id: 64,
      selector: ".recommended__users--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 65,
      selector: ".specific__user--tile",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 66,
      selector: ".other__posts--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 67,
      selector: ".empty__content--container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 68,
      selector: ".confirm__container",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 70,
      selector: "#other__posts--tile",
      type: "background",
      style: "var(--hover-on-black-DM)",
      method: "query",
    },
    {
      id: 71,
      selector: ".interaction__option i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 72,
      selector: ".nav__category--tile",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 72,
      selector: ".feed__dropdown--button i",
      type: "background",
      style: "",
      method: "query",
    },
    {
      id: 72,
      selector: ".full__blur--wrapper",
      type: "background",
      style: "rgba(249, 245, 249, .3)",
      method: "query",
    },
    {
      id: 75,
      selector: "html",
      type: "background",
      style: "rgba(24, 23, 17, 1)",
      method: "query",
    },
    {
      id: 76,
      selector: ".your__profile--card--container",
      type: "border-bottom",
      style: "var(--border-DM)",
      method: "query",
    },
    {
      id: 77,
      selector: ".profile__card--upper--top",
      type: "border-bottom",
      style: "var(--border-on-hover-DM)",
      method: "query",
    },
    {
      id: 78,
      selector: ".user__tile--right--component--wrapper",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 79,
      selector: ".user__top--posts--top--container",
      type: "border-bottom",
      style: "var(--border-on-hover-DM)",
      method: "query",
    },
    {
      id: 80,
      selector: ".user__top--post--tile",
      type: "border",
      style: "var(--border-on-hover-DM)",
      method: "query",
    },
    {
      id: 81,
      selector: ".create__style--wrapper",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
    {
      id: 82,
      selector: ".user__tile--top--comment--tile",
      type: "background",
      style: "var(--hover-DM)",
      method: "query",
    },
  ];

  //dark mode enable/disable

  window.darkMode = (inherit?: string) => {
    //root background
    document.getElementById(`root`)!.style.background = !inherit
      ? `var(--black-DM)`
      : inherit;

    //master colors

    document
      .querySelectorAll(`p, h1, h2, h3, h4, h5, svg`)
      .forEach((data) =>
        data.setAttribute(
          `style`,
          `color: ${!inherit ? `var(--white-DM)` : undefined}; !important`
        )
      );

    //query selectors -- background

    darkModeOptions
      .filter((data) => data.method == "query" && data.type == "background")
      .map((el) =>
        document
          .querySelectorAll(el.selector)
          .forEach((data) =>
            data.setAttribute(
              `style`,
              `background: ${!inherit ? el.style : undefined}; color: ${
                !inherit ? `var(--white-DM)` : undefined
              } !important`
            )
          )
      );

    //query selectors -- border-bottom

    darkModeOptions
      .filter((data) => data.method == "query" && data.type == "border-bottom")
      .map((el) =>
        document
          .querySelectorAll(el.selector)
          .forEach((data) =>
            data.setAttribute(
              "style",
              `border-bottom: ${!inherit ? el.style : undefined}; !important`
            )
          )
      );

    //border-right

    darkModeOptions
      .filter((data) => data.method == "query" && data.type == "border-right")
      .map((el) =>
        document
          .querySelectorAll(el.selector)
          .forEach((data) =>
            data.setAttribute(
              "style",
              `border-right: ${!inherit ? el.style : undefined}; !important`
            )
          )
      );

    //border-bottom

    darkModeOptions
      .filter((data) => data.method == "query" && data.type == "border-top")
      .map((el) =>
        document
          .querySelectorAll(el.selector)
          .forEach((data) =>
            data.setAttribute(
              "style",
              `border-top: ${!inherit ? el.style : undefined}; !important`
            )
          )
      );

    //border

    darkModeOptions
      .filter((data) => data.method == "query" && data.type == "border")
      .map((el) =>
        document
          .querySelectorAll(el.selector)
          .forEach((data) =>
            data.setAttribute(
              "style",
              `border: ${!inherit ? el.style : undefined}; !important`
            )
          )
      );
  };

  //check dark mode
  window.themeCheck = async (id: string) => {
    const res = await axios.get(
      `http://localhost:1000/jot-user-preferences?theme=true&userId=${
        id == undefined ? token : id
      }`
    );
    setDarkActive(res.data);

    if (res.data == !false) {
      window.darkMode();
    } else {
      window.darkMode("inherit");
    }
  };

  //login check

  window.loginCheck = (token: string) => {
    if (token == null) {
      setLoggedin(false);
    } else {
      setLoggedin(!false);
    }
  };

  //recommended users

  window.recommendedUsers = async (token: string) => {
    if (token) {
      const res = await axios.get(
        `http://localhost:1000/jot-users?recommendedUsers=true&userId=${token} `
      );
      setUserSuggestions(res.data);
    } else {
      const res = await axios.get(
        `http://localhost:1000/jot-users?loggedOutRecommendedUsers=true`
      );
      setUserSuggestions(res.data);
    }
  };

  //global notification check

  window.notificationCheck = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-users?globalNotifications=true&userId=${token}`
      );
      setReadCount(res.data[0].length);
    } catch (err) {}
  };

  //follow request alert

  window.followRequestAlert = async (userId?: string) => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?followRequestAlert=true&userId=${token}&userProfileId=${userId}`
    );
    setFollowRequestAlerts(res.data);

    if (res.data == "") {
      setFollowRequestAlerts(undefined);
    }
  };

  //message check global

  window.globalUserMessageCheck = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-messages?globalUserMessageFetch=true&userId=${token}`
    );
    if (res.data != false) {
      setMessageData(res.data);
    }
  };

  //message read

  window.messageRead = async (
    conversationId: string,
    selectedUnread?: boolean
  ) => {
    const res = await axios.put(
      `http://localhost:1000/jot-messages?setUnread=true&convoId=${conversationId}&userId=${token}&selectedUnread=${selectedUnread}`
    );
    setMessageRead(res.data);
  };

  //handle notifications

  window.handleNotification = async (notificationData: NotificationData) => {
    const notiRes = await axios.put(
      `http://localhost:1000/jot-users?notification=true&referenceUserId=${notificationData.referenceUserId}&username=${notificationData.username}&likerId=${notificationData.actionUserId}&referenceId=${notificationData.referenceId}&type=${notificationData.type}`
    );

    setNotificationResType(notiRes.data);
    window.notificationCheck();
  };

  // media

  window.mediaChange = (mobile: any) => {
    setMobileMedia(mobile.matches);
  };

  //substring change for mobile

  window.addEventListener("resize", () =>
    setMobileTextLimit(Math.floor(window.screen.width / 12))
  );

  useEffect(() => {
    if (token != null) {
      window.themeCheck();
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider
          value={{
            darkActive: darkActive,
            loggedin: loggedin,
            loginActive: loginActive,
            setLoginActive: setLoginActive,
            userSuggestions: userSuggestions,
            readCount: readCount,
            setReadCount: setReadCount,
            signup: signup,
            setSignup: setSignup,
            page: page,
            setPage: setPage,
            followRequestAlerts: followRequestAlerts,
            setFollowRequestAlerts: setFollowRequestAlerts,
            confirmActive: confirmActive,
            setConfirmActive: setConfirmActive,
            createActive: createActive,
            setCreateActive: setCreateActive,
            setConfirmConditions: setConfirmConditions,
            messageData: messageData,
            setMessageData: setMessageData,
            messageRead: messageRead,
            setMessageRead: setMessageRead,
            notificationResType: notificationResType,
            reportActive: reportActive,
            setReportActive: setReportActive,
            setReportConditions: setReportConditions,
            mobileMedia: mobileMedia,
            mobileTextLimit: mobileTextLimit,
            setPasswordRecovery: setPasswordRecovery,
            bioActive: bioActive,
            setBioActive: setBioActive,
            setExistingBio: setExistingBio,
            existingBio: existingBio,
            changeFavoritesActive: changeFavoritesActive,
            setChangeFavoritesActive: setChangeFavoritesActive,
            setUserFavoritesForUpdate: setUserFavoritesForUpdate,
            userFavoritesForUpdate: userFavoritesForUpdate,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="/home/:userId?/:searchCategory?" element={<Home />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/post/:postId/" element={<Post />} />
            <Route path="/user/:username/:userId" element={<UserProfile />} />
            <Route
              path="/user-posts/:username/:userId"
              element={<UserPosts />}
            />

            <Route
              path="/search/:searchContent/:userId"
              element={<SearchAll />}
            />
            <Route
              path="/messages/:username/:userId/:convoId?"
              element={<Messages />}
            />
            <Route
              path="/error/:errorResource/:errorType"
              element={<Error />}
            />
            <Route path="/info/:infoRequest" element={<Info />} />
          </Routes>
          {createActive == !false ? <CreatePost /> : null}
          {confirmActive == !false ? (
            <ConfirmPopup
              content={confirmConditions?.content}
              confirmAction={confirmConditions?.confirmAction}
              secondAction={confirmConditions?.secondAction}
              secondOptionalValue={confirmConditions?.secondOptionalValue}
            />
          ) : null}
          {loginActive == !false ? <Login /> : null}
          {reportActive == !false ? <Report data={reportConditions!} /> : null}
          {passwordRecovery == !false ? <PasswordRecovery /> : null}
          {bioActive == !false ? <EditBio /> : null}
          {changeFavoritesActive == !false ? <UpdateFavorites /> : null}
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
