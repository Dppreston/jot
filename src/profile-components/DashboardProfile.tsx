import { useEffect, useRef } from "react";

import ProfileSideTile from "../side-components/ProfileSideTile";
type ProfileProps = {
  profileOptions: {
    id: number;
    option: string;
    icon: string;
  }[];
  profilePic: string | undefined;
};

type Selection = {
  menuDetection: any;
};

type UserData = {
  username: string | undefined;
  imgVersion: number | undefined;
  memberSince: string;
};

const DashboardProfile = ({
  profileOptions,
  menuDetection,
  username,
  imgVersion,
  memberSince,
  profilePic,
}: ProfileProps & Selection & UserData) => {
  const yourProfileRef = useRef<any>();

  //button selection

  const selection = (element: Element) => {
    const list = document
      .querySelector(".profile__options--wrapper")
      ?.getElementsByTagName("button");

    for (let i = 0; i < list!.length; i++) {
      list![i].classList.remove("button__selected");
      yourProfileRef.current.classList.remove("button__selected");
    }
    element.classList.add("button__selected");
  };

  useEffect(() => {
    yourProfileRef.current.classList.add("button__selected");
  }, []);

  return (
    <>
      <div className="dashboard__profile">
        <ProfileSideTile
          profilePic={profilePic}
          imgVersion={imgVersion}
          memberSince={memberSince}
          username={username}
        />

        <div
          className="your__profile--card--container 
        "
        >
          <button
            className="profile__buttons nav__category--tile"
            ref={yourProfileRef}
            onClick={(e) => {
              selection(e.currentTarget);
              menuDetection(5);
            }}
          >
            <i className="fa-solid fa-user"></i>Your Profile
          </button>
        </div>
        <div className="profile__options--wrapper">
          {profileOptions!.map((option) => (
            <button
              className="profile__buttons nav__category--tile "
              key={option.id}
              onClick={(e) => {
                selection(e.currentTarget);
                menuDetection(option.id, option.option);
              }}
            >
              <i className={option.icon}></i> <p>{option.option}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
export default DashboardProfile;
