import { useContext, useEffect, useState } from "react";
import { GlobalContext, UserContext } from "../App";
import axios from "axios";

const token: string | null = localStorage.getItem(`token`);

type FollowProps = {
  userId: string | undefined;
  followUser: Function;
  followCheckRes: boolean;
  privateProfile: boolean;
};

const Follow = ({
  userId,
  followUser,
  followCheckRes,
  privateProfile,
}: FollowProps) => {
  const { setLoginActive, darkActive, loggedin } =
    useContext<GlobalContext>(UserContext);
  const [followRequestCheckData, setFollowRequestCheckData] =
    useState<boolean>(false);

  //follow request check on load

  const followRequestCheck = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?followRequestCheck=true&receivingUserId=${userId}&userId=${token}`
    );

    setFollowRequestCheckData(res.data);
  };

  //send follow request

  const followRequest = async () => {
    const res = await axios.put(
      `http://localhost:1000/jot-users?followRequest=true&receivingUserId=${userId}&userId=${token}`
    );
    if (res.data) {
      followRequestCheck();
    }
  };

  const cancelFollowRequest = async () => {
    const res = await axios.put(
      `http://localhost:1000/jot-users?cancelFollowRequest=true&receivingUserId=${userId}&userId=${token}`
    );
    if (res.data == true) {
      followRequestCheck();
    }
  };

  useEffect(() => {
    followRequestCheck();
  }, []);
  return (
    <>
      {userId != token && privateProfile == false ? (
        <button
          id="follow__user"
          onClick={(e) => {
            if (loggedin == !false) {
              followUser();
              e.currentTarget.classList.add("like__style");
            } else {
              setLoginActive(!false);
            }
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove("like__style");
          }}
          style={
            followCheckRes == !false
              ? {
                  background: "var(--accent)",
                  color: "white",
                }
              : undefined || (darkActive == !false && followCheckRes == false)
              ? { background: "var(--hover-DM)" }
              : undefined
          }
        >
          {followCheckRes == false ? <h4>Follow</h4> : <h4>Following</h4>}
        </button>
      ) : userId != token && privateProfile == !false ? (
        <button
          id="follow__user"
          onClick={(e) => {
            if (
              loggedin == !false &&
              followRequestCheckData == false &&
              followCheckRes == false
            ) {
              followRequest();
              e.currentTarget.classList.add("like__style");
            }

            if (loggedin == false) {
              setLoginActive(!false);
            }

            if (followRequestCheckData == !false) {
              cancelFollowRequest();
            }

            if (followCheckRes == !false) {
              followUser();
            }
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove("like__style");
          }}
          style={
            followCheckRes == !false
              ? {
                  background: "var(--accent)",
                  color: "white",
                }
              : undefined || (darkActive == !false && followCheckRes == false)
              ? { background: "var(--hover-DM)" }
              : undefined
          }
        >
          {followCheckRes == false && followRequestCheckData == false ? (
            <h4>Request</h4>
          ) : followCheckRes == false && followRequestCheckData == !false ? (
            <h4>Pending</h4>
          ) : followCheckRes == !false && followRequestCheckData == false ? (
            <h4>Following</h4>
          ) : (
            <h4>Request To Follow</h4>
          )}
        </button>
      ) : null}
    </>
  );
};
export default Follow;
