import { useContext, useEffect } from "react";
import logo from "../assets/jot-logo.png";
import { GlobalContext, UserContext } from "../App";

type ProfileSideTileProps = {
  profilePic: string | undefined;
  imgVersion: number | undefined;
  memberSince: string | undefined;
  username: string | undefined;
  userId?: string;
  button?: boolean;
};

const ProfileSideTile = ({
  imgVersion,
  memberSince,
  username,
  userId,
  button,
  profilePic,
}: ProfileSideTileProps) => {
  const { darkActive, mobileMedia } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div
        className="profile__side--tile"
        style={
          darkActive == !false
            ? { background: "var(--hover-on-black-DM)" }
            : undefined
        }
      >
        <div className="profile__side--tile--top">
          <div className="profile__side--tile--info--container">
            <h4 className="profile__username">{username}</h4>
            <p>Member Since: {memberSince}</p>
          </div>

          <div className="profile__img--container">
            <img
              src={
                profilePic != ""
                  ? `${profilePic}.js?version=${imgVersion}`
                  : logo
              }
              id="profile__dashboard--img"
              style={
                profilePic != "" ? undefined : { width: "75%", height: "auto" }
              }
              onClick={() => {
                window.location.href = `${window.location.origin}/user/${username}/${userId}`;
              }}
            />
          </div>
        </div>
        {button && mobileMedia == false ? (
          <button
            id="go__to--profile"
            onClick={() => {
              window.location.href = `${window.location.origin}/user/${username}/${userId}`;
            }}
          >
            <h4>Go to profile</h4>
          </button>
        ) : null}
      </div>
    </>
  );
};
export default ProfileSideTile;
