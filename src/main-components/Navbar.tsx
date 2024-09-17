import logo from "../assets/jot-logo.png";
import darkLogo from "../assets/jot-logo-DM.png";
import profileFiller from "../assets/profile__pic--filler.png";
import { useState, useEffect, useRef, useContext } from "react";
import Search from "./Search";
import axios from "axios";
import categories from "../staticdata/Categories";
import InfoData from "../staticdata/InfoData";
import InformationPopup from "../popup-components/InformationPopup";
import notificationTemplate from "../staticdata/NotificationData";
import { GlobalContext, UserContext } from "../App";
import Button from "../buttons/ButtonMain";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import Icon from "../buttons/Icon";
import { helpOptions } from "../side-components/Help";
const token: string | null = localStorage.getItem("token");

const homeCategories: {
  id: number;
  title: string;
  icon: string;
  info?: string;
  loggedout?: boolean;
}[] = [
  {
    id: 51,
    title: "popular",
    icon: "fa-solid fa-fire",
    info: "",
  },
  {
    id: 50,
    title: "just for you",
    icon: "fa-solid fa-star",
    info: "fa-solid fa-info",
    loggedout: false,
  },
];
type UserDropdownProps = {
  dropDownOptions?: {
    id?: number;
    title?: string;
    path?: string;
  }[];
  username: string;
  profilePic: string;
  imgVersion: number;
};

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  notifications: [];
  profilePicture: string;
  profileImgVersion: number;
};

type UserDataProps = {
  userData: UserData[] | undefined;
};

type NavbarProps = {
  selectedCategory?: string;
  homeDropdown?: boolean;
  categoryCheck?: Function;
  iconDetection?: Function;
  loggedOutPopularCats?: LoggedOutPopular[];
};

type NotificationIndividual = {
  _id: number;
  username: string;
  postId: string;
  postUserId: string;
  read: boolean;
  action: string;
  type: string;
  creationDate: Date;
}[];

type NotificationDataProps = {
  notificationData: {
    _id: number;
    username: string;
    postId: string;
    postUserId: string;
    read: boolean;
    action: string;
    type: string;
    creationDate: Date;
  };
  fetchNotifications: Function;
  username: string;
};

type LoggedOutPopular = {
  id: number;
  icon: string;
  title: string;
};

export const NavbarUserDrop = ({
  username,
  profilePic,
  imgVersion,
}: UserDropdownProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //user dropdown options

  const userDropDownOptions: {
    id: number;
    title: string;
    path?: string;
    icon?: string;
    color?: string;
  }[] = [
    {
      id: 1,
      title: "Dashboard",
      path: "user-dashboard",
      icon: "fa-regular fa-user",
    },
    {
      id: 2,
      title: "Messages",
      path: `messages/${username}/${token}`,
      icon: "fa-regular fa-envelope",
    },
    {
      id: 3,
      title: "Dark Mode",
      icon: darkActive == !false ? "fa-solid fa-moon" : "fa-regular fa-moon",
    },
    {
      id: 4,
      title: "Logout",
      path: "/",
      icon: "fa-solid fa-right-from-bracket",
      color: "var(--input-error)",
    },
  ];

  const updateDarkmodeToggle = async (active: boolean) => {
    await axios.put(
      `/jot-user-preferences?updateDarkmode=true&userId=${token}&currentState=${active}`
    );

    window.themeCheck();
  };

  return (
    <>
      <div className="navbar__user--dropdown--upper">
        <div className="user__dropdown--profile--card">
          <img
            src={`${profilePic}.js?version=${imgVersion}`}
            id="user__drop--img"
          />{" "}
          <h3>{username}</h3>
        </div>
      </div>
      <div className="navbar__user--dropdown--middle">
        {userDropDownOptions
          ?.filter((el) => el.id == 1 || el.id == 2)
          .map((data) => (
            <section
              className="user__option--middle"
              key={data.id}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${window.location.origin}/${data.path}/`;
              }}
            >
              <Icon
                icon={data.icon!}
                shape={true}
                width={"13px"}
                height={"13px"}
              />
              <h4>{data.title}</h4>
            </section>
          ))}

        <div className="navbar__user--dropdown--bottom">
          {userDropDownOptions
            ?.filter((el) => el.id == 3 || el.id == 4)
            .map((data) => (
              <section
                key={data.id}
                onClick={() => {
                  if (data.id == 3) {
                    updateDarkmodeToggle(darkActive == !false ? false : !false);
                  } else {
                    localStorage.clear();
                    window.location.href = `${window.location.origin}/`;
                  }
                }}
              >
                <Icon
                  icon={data.icon!}
                  width="13px"
                  height="13px"
                  color={darkActive == false ? data.color : "var(--white-DM)"}
                  shape={true}
                  background={
                    darkActive == !false && data.id == 3
                      ? "var(--accent)"
                      : undefined
                  }
                />
              </section>
            ))}
        </div>
      </div>
    </>
  );
};

export const NotificationTile = ({
  notificationData,
  fetchNotifications,
  username,
}: NotificationDataProps) => {
  const [deleteActive, setDeleteActive] = useState<boolean>(false);
  const [, setLoading] = useState<boolean>(false);
  const deleteRef = useRef<any>();
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  //handle read

  const handleRead = async () => {
    try {
      await axios.put(
        `/jot-users?readChange=true&notiId=${notificationData._id}&userId=${token}`
      );

      fetchNotifications();
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
    if (mobileMedia == !false) {
      setDeleteActive(!false);
    }
  }, []);

  //noti delete

  const handleNotiDelete = async () => {
    try {
      const res = await axios.put(
        `/jot-users?deleteNotification=true&notiId=${notificationData._id}&userId=${token}`
      );
      if (res.data) {
        setTimeout(() => {
          setLoading(false);
        }, 4000);
      }
    } catch {}
  };

  return (
    <>
      <div
        className="notification__tile"
        onClick={() => {
          handleRead();
        }}
        onMouseEnter={() => {
          setDeleteActive(!false);
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            handleRead();
            window.notificationCheck();
          }, 300);
          setDeleteActive(false);
        }}
      >
        <div className="noti__tile--bottom">
          <div className="noti__icons">
            {notificationData
              ? notificationTemplate
                  .filter((data) => data.type == notificationData.type)
                  .map((el) => (
                    <i
                      className={el.icon}
                      id="noti__type--icon"
                      key={el.icon}
                    ></i>
                  ))
              : null}
          </div>
          <div
            className="noti__content"
            onClick={() => {
              if (
                notificationData.type == "newMessage" ||
                notificationData.type == "messageLike" ||
                notificationData.type == "messageDislike"
              ) {
                window.location.href = `${window.location.origin}/messages/${username}/${token}/${notificationData.postId}`;
              } else {
                window.location.href = `${window.location.origin}/post/${notificationData.postId}`;
              }
            }}
          >
            <span id="notification__username">{notificationData.username}</span>{" "}
            <span id="notification__action">
              {notificationData.action}
              {notificationData.read == false ? (
                <i className="fa-solid fa-circle" id="read__identifier"></i>
              ) : null}
            </span>{" "}
          </div>
          {deleteActive == !false ? (
            <div
              className="noti__delete"
              ref={deleteRef}
              onClick={() => {
                handleNotiDelete();
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export const NavbarNotificationDrop = ({ userData }: UserDataProps) => {
  const [notificationData, setNotificationData] = useState<
    NotificationIndividual[]
  >(userData![0].notifications);

  //fetch notifications

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/jot-users?fetchNoti=true&userId=${token}`);

      //sort by date
      const dateSort = res.data[0].notifications.sort(
        (a: any, b: any) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      );

      if (dateSort) {
        setNotificationData(dateSort);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <div className="notification__dropdown--upper">
        <h4>Notifications</h4>
      </div>

      <div className="notification__dropdown--tile--container">
        {notificationData.length > 0
          ? notificationData.map((data: any) => (
              <NotificationTile
                notificationData={data}
                fetchNotifications={fetchNotifications}
                key={data._id}
                username={userData![0].username}
              />
            ))
          : emptyData
              .filter((el) => el.id == 9)
              .map((data, key) => <EmptyContent data={data} key={key} />)}
      </div>
    </>
  );
};

{
}

export const NavbarHomeNavDropdown = ({
  categoryCheck,
  homeDropdown,
  iconDetection,
  loggedOutPopularCats,
}: NavbarProps) => {
  const [, setUserData] = useState<UserData[] | undefined>();
  const [favorites, setFavorites] = useState<any>();
  const [allCats, setAllCats] = useState<boolean>(false);
  const [helpActive, setHelpActive] = useState<boolean>(false);
  const [info, setInfo] = useState<boolean>(false);
  const { loggedin, darkActive, mobileMedia } =
    useContext<GlobalContext>(UserContext);

  const userFavorites = async () => {
    try {
      const res = await axios.get(
        `/jot-users/?userFavorites=true&userId=${token}`
      );

      setUserData(res.data);
      setFavorites(res.data[0].favoriteCategories);
    } catch (err) {
      console.log(err);
    }
  };

  //matched favorite categories

  const matched = categories.filter((all) => favorites!?.includes(all.id));

  useEffect(() => {
    if (loggedin == !false) {
      userFavorites();
    }
  }, [homeDropdown, loggedin]);

  return (
    <>
      <div className="home__dropdown--top">
        <p className="nav__dropdown--subtitle">Relevant</p>
        {homeCategories
          ?.filter((data) => data.loggedout != loggedin)
          .map((cat) => (
            <section
              className="nav__category--tile"
              key={cat.id}
              onClick={() => {
                categoryCheck!(cat.title);
                iconDetection!(cat.icon);
              }}
            >
              <Icon icon={cat.icon} width="13px" height="13px" shape={!false} />
              <p>{cat.title}</p>
              {mobileMedia == false ? (
                <div
                  className="for__you--info--container"
                  onMouseOver={() => setInfo(!false)}
                  onMouseLeave={() => setInfo(false)}
                >
                  {cat.info != "" ? (
                    <i
                      className="fa-regular fa-circle-question"
                      style={
                        darkActive == !false
                          ? { color: "var(--white-DM)" }
                          : undefined
                      }
                    ></i>
                  ) : null}
                  {info == !false && cat.info != "" ? (
                    <InformationPopup data={InfoData[0]} />
                  ) : null}
                </div>
              ) : null}
            </section>
          ))}
      </div>
      {loggedin == !false ? (
        <div className="home__dropdown--middle">
          <p className="nav__dropdown--subtitle">Your favorites</p>
          {matched?.map((cat) => (
            <section
              className="nav__category--tile"
              key={cat.id}
              onClick={() => {
                categoryCheck!(cat.title);
                iconDetection!(cat.icon);
              }}
            >
              <Icon icon={cat.icon} width="13px" height="13px" shape={!false} />
              <p>{cat.title}</p>
            </section>
          ))}
        </div>
      ) : (
        <div className="home__dropdown--middle">
          <p className="nav__dropdown--subtitle">Popular Categories</p>
          {loggedOutPopularCats
            ?.map((cat) => (
              <section
                className="nav__category--tile"
                key={cat.id}
                onClick={() => {
                  categoryCheck!(cat.title);
                  iconDetection!(cat.icon);
                }}
              >
                <Icon
                  icon={cat.icon}
                  width="13px"
                  height="13px"
                  shape={!false}
                />
                <p>{cat.title}</p>
              </section>
            ))
            .slice(0, 4)}
        </div>
      )}

      <div
        className="home__dropdown--bottom"
        onClick={() => {
          setAllCats(!false);
          setHelpActive(false);
          if (allCats == !false) {
            setAllCats(false);
          }
        }}
      >
        <p className="nav__dropdown--subtitle">All Categories</p>
        {allCats == false ? (
          <i className="fa-solid fa-chevron-right"></i>
        ) : (
          <i className="fa-solid fa-chevron-down"></i>
        )}
      </div>

      {allCats == !false ? (
        <div
          className="all__categories--container"
          style={{ animation: "navDropdown 0.2s forwards" }}
        >
          {categories?.map((cat) => (
            <section
              className="nav__category--tile"
              key={cat.id}
              onClick={() => {
                categoryCheck!(cat.title);
                iconDetection!(cat.icon);
              }}
            >
              <Icon icon={cat.icon} width="13px" height="13px" shape={!false} />
              <p>{cat.title}</p>
            </section>
          ))}
        </div>
      ) : null}
      <div
        className="home__dropdown--bottom"
        onClick={() => {
          setHelpActive(!false);
          setAllCats(false);
          if (helpActive == !false) {
            setHelpActive(false);
          }
        }}
      >
        <p
          className="nav__dropdown--subtitle"
          style={
            darkActive == !false ? { color: "var(--white-DM)" } : undefined
          }
        >
          Help
        </p>
        {helpActive == false ? (
          <i className="fa-solid fa-chevron-right"></i>
        ) : (
          <i className="fa-solid fa-chevron-down"></i>
        )}
      </div>
      {helpActive == !false ? (
        <div
          className="all__categories--container"
          style={{
            animation: "navDropdown 0.2s forwards",
          }}
        >
          {helpOptions?.map((data) => (
            <section
              className="nav__category--tile"
              key={data.id}
              onClick={() => {
                window.location.href = `${window.location.origin}/info/${data.path}`;
              }}
            >
              <h4>{data.option}</h4>
            </section>
          ))}
        </div>
      ) : null}
    </>
  );
};

const Navbar = ({ selectedCategory, categoryCheck }: NavbarProps) => {
  const [userDropdown, setUserdropdown] = useState<boolean>(false);
  const [dropdownSelection, setDropdownSelection] = useState<string>("");
  const [userData, setUserData] = useState<UserData[]>();
  const [homeDropdown, setHomeDropdown] = useState<boolean>(false);
  const [homeDetection, setHomeDetection] = useState<boolean>(false);
  const [navDropdown, setNavDropdown] = useState<boolean>(false);
  const [icon, setIcon] = useState<string>("");
  const [loggedOutPopularCats] = useState<LoggedOutPopular[]>(categories);
  const userDropRef = useRef<any>();
  const notificationRef = useRef<any>();
  const menuRef = useRef<any>();

  window.addEventListener("mousedown", (e) => {
    if (userDropdown && !userDropRef.current?.contains(e.target)) {
      setUserdropdown(false);
    }

    if (navDropdown && !notificationRef.current?.contains(e.target)) {
      setNavDropdown(false);
    }
    if (homeDropdown && !menuRef.current?.contains(e.target)) {
      setHomeDropdown(false);
    }
  });

  const {
    darkActive,
    loggedin,
    setLoginActive,
    setCreateActive,
    readCount,
    mobileMedia,
  } = useContext<GlobalContext>(UserContext);

  const onFocus = () => setUserdropdown(!false);
  const onBlur = () => setUserdropdown(false);
  const onNavFocus = () => setNavDropdown(!false);
  const onNavBlur = () => {
    setNavDropdown(false);
    loggedin == !false ? window.notificationCheck() : null;
  };

  const userCheck = async () => {
    try {
      const res = await axios.get(`/jot-users/?home=true&userId=${token}`);
      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //home detection

  const PageDetection = () => {
    if (window.location.pathname.includes(`home`)) {
      setHomeDetection(!false);
    } else {
      setHomeDetection(false);
    }
  };

  const iconDetection = (icon: string) => {
    setIcon(icon);
  };

  //logged out popular categories

  const loggedOutPopular = () => {
    let currentIndex = categories.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [
        loggedOutPopularCats![currentIndex],
        loggedOutPopularCats![randomIndex],
      ] = [
        loggedOutPopularCats![randomIndex],
        loggedOutPopularCats![currentIndex],
      ];
    }
  };

  useEffect(() => {
    setHomeDropdown(false);
  }, [selectedCategory]);

  useEffect(() => {
    window.loginCheck(token);
    PageDetection();
  }, []);

  useEffect(() => {
    if (loggedin == !false) {
      window.notificationCheck();
      window.themeCheck();
      userCheck();
    } else {
      loggedOutPopular();
      setIcon("fa-solid fa-fire");
    }
  }, [loggedin]);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [[], homeDropdown, userDropdown, navDropdown]);

  return (
    <>
      <div className="navbar__outer">
        <div className="navbar__inner">
          <div className="navbar__logo--container">
            <img
              src={darkActive == false || loggedin == false ? logo : darkLogo}
              alt="logo"
              id="logo"
            />
          </div>
          <div className="navbar__center--container">
            {homeDetection == !false ? (
              <div className="navbar__main--menu--wrapper">
                <button
                  className="nav__dropdown--button"
                  id="home__nav"
                  onClick={() => setHomeDropdown(!false)}
                  style={
                    mobileMedia == !false
                      ? { background: "none" }
                      : undefined || darkActive == !false
                      ? { background: "var(--hover-on-black-DM)" }
                      : undefined
                  }
                >
                  <i className={icon ? icon : "fa-solid fa-fire"}></i>
                  <p className="nav__dropdown--initial">
                    {selectedCategory ? selectedCategory : "just for you"}
                  </p>
                  {homeDropdown == false ? (
                    <i className="fa-solid fa-chevron-right dropdown__icon"></i>
                  ) : (
                    <i className="fa-solid fa-chevron-down dropdown__icon"></i>
                  )}
                  {homeDropdown == !false ? (
                    <div className="home__nav--dropdown" ref={menuRef}>
                      <NavbarHomeNavDropdown
                        homeDropdown={homeDropdown}
                        categoryCheck={categoryCheck}
                        iconDetection={iconDetection}
                        loggedOutPopularCats={loggedOutPopularCats}
                      />
                    </div>
                  ) : null}
                </button>
              </div>
            ) : (
              <div className="navbar__main--menu--wrapper main__menu--OTHER">
                <button
                  onClick={() => {
                    window.location.href = "/home";
                  }}
                >
                  <i className="fa-solid fa-house"></i>
                </button>
              </div>
            )}
            <Search />
            {loggedin == !false ? (
              <button
                className="nav__create--post"
                id="nav__create--post--button"
                onClick={() => setCreateActive(!false)}
              >
                <i className="fa-solid fa-plus"></i>{" "}
                {mobileMedia == false ? <p>Create</p> : null}
              </button>
            ) : null}
            {loggedin == !false ? (
              <button
                className="center__nav--style"
                onFocus={onNavFocus}
                onBlur={onNavBlur}
                id="notification__nav"
                onClick={(e) => {
                  setNavDropdown(!false);
                  setDropdownSelection(e.currentTarget.value);
                }}
              >
                <i className="fa-regular fa-bell"></i>
                {navDropdown == !false && userData != undefined ? (
                  <div
                    className="notification__dropdown--wrapper"
                    ref={notificationRef}
                  >
                    <NavbarNotificationDrop userData={userData} />
                  </div>
                ) : null}
                {readCount! > 0 ? (
                  <i className="unread__noti fa-solid fa-circle"></i>
                ) : null}
              </button>
            ) : null}
            {loggedin == !false ? (
              <button
                className="profile__dropdown--inner"
                id="user__dropdown--button"
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={() => {
                  setUserdropdown(!false);
                  setDropdownSelection("user");
                }}
                style={
                  mobileMedia == !false
                    ? { background: "none" }
                    : undefined || darkActive == !false
                    ? { background: "var(--hover-on-black-DM)" }
                    : undefined
                }
              >
                <div className="nav__profile--picture--container">
                  <img
                    src={
                      userData! != undefined &&
                      userData![0]?.profilePicture != ""
                        ? `${userData![0]?.profilePicture}.js?version=${
                            userData[0].profileImgVersion
                          }`
                        : profileFiller
                    }
                    id="nav__profile--picture"
                    style={
                      userData! != undefined &&
                      userData![0]?.profilePicture != ""
                        ? { width: "inherit", height: "inherit" }
                        : { width: "100%", height: "auto" }
                    }
                    loading="lazy"
                  />
                </div>
                {mobileMedia == false ? (
                  <p className="home__user--drop--username">
                    {userData == null ? "profile" : userData![0]?.username}
                  </p>
                ) : null}
                {mobileMedia == false ? (
                  userDropdown == false ? (
                    <i className="fa-solid fa-chevron-right"></i>
                  ) : (
                    <i className="fa-solid fa-chevron-down"></i>
                  )
                ) : null}

                {userDropdown == !false && dropdownSelection == "user" ? (
                  <div className="navbar__dropdown--wrapper" ref={userDropRef}>
                    <NavbarUserDrop
                      username={userData![0]?.username}
                      profilePic={userData![0].profilePicture}
                      imgVersion={userData![0].profileImgVersion}
                    />
                  </div>
                ) : null}
              </button>
            ) : (
              <div className="home__signed-out-login-container">
                <Button
                  content="Get Started"
                  inactive={!false}
                  action={setLoginActive}
                  optionalValue={!false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
