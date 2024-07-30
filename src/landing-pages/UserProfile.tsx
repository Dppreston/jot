import axios from "axios";
import Navbar from "../main-components/Navbar";
import UserProfileTile from "../profile-components/UserProfileCard";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import RecUsers from "../side-components/RecUsers";
import { GlobalContext, UserContext } from "../App";
import FollowRequest from "../side-components/FollowRequest";
import FollowerFollowing from "../popup-components/FollowerFollowing";
import Error from "./Error";
import errorData from "../staticdata/ErrData";

const token: string | null = localStorage.getItem("token");

type UserData = {
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
};

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<UserData[]>();
  const [memberSince, setMemberSince] = useState<string>("");
  const [privateProfile, setPrivateProfile] = useState<boolean>(false);
  const [ffAction, setFFAction] = useState<number>();
  const { userSuggestions, loggedin, followRequestAlerts } =
    useContext<GlobalContext>(UserContext);

  //fetch User Data

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-users?userProfileUser=true&userId=${userId}`
      );
      if (res.data != null) {
        setUserData(res.data);
      } else {
        window.location.href = `${window.location.origin}/error/${userId}/404`;
      }
    } catch (err) {
      console.log(err);
    }
  };

  //date joined

  const dateJoined = () => {
    const dateJoined = new Date(userData![0].creationDate).toLocaleDateString();
    setMemberSince(dateJoined);
  };

  //check profile for private

  const privateProfileCheck = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-user-preferences?privateProfileCheck=true&userId=${userId}`
    );
    setPrivateProfile(res.data);
  };

  const followerFollowingPopupDetection = (res: number) => {
    setFFAction(res);
  };

  useEffect(() => {
    if (userData != undefined) {
      dateJoined();

      privateProfileCheck();
      window.recommendedUsers(token);

      if (loggedin == !false) {
        setTimeout(() => {
          window.followRequestAlert(userId);
        }, 300);
      }
    }
  }, [userData]);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper">
          <div className="site__column--wrapper">
            {userData != undefined ? (
              <UserProfileTile
                userData={userData[0]}
                memberSince={memberSince}
                privateProfile={privateProfile}
                master={false}
                ffAction={followerFollowingPopupDetection}
              />
            ) : null}
          </div>
          <div className="site__column--wrapper">
            {followRequestAlerts!?.length > 0
              ? followRequestAlerts
                  ?.filter((el) => el._id === userId)
                  .map((data, key) => (
                    <FollowRequest userData={data} key={key} />
                  ))
              : null}

            <div className="recommended__users--container">
              <h4>Recommended Users</h4>
              {userSuggestions != undefined
                ? userSuggestions.map((data, key) => (
                    <RecUsers userSuggestions={data} key={key} />
                  ))
                : null}
            </div>
          </div>
        </div>
        {ffAction != undefined ? (
          <FollowerFollowing
            action={ffAction}
            close={setFFAction}
            userId={userId}
          />
        ) : null}
      </div>
    </>
  );
};
export default UserProfile;
