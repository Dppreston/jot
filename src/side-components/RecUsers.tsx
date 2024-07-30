import logo from "../assets/profile__pic--filler.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type UserSuggestionsProps = {
  userSuggestions:
    | {
        _id: string;
        username: string;
        profilePicture: string;
        profileImgVersion: number;
      }
    | undefined;
};

const RecUsers = ({ userSuggestions }: UserSuggestionsProps) => {
  return (
    <>
      <button
        className="recommended__users--tile"
        onClick={() => {
          window.location.href = `${window.location.origin}/user/${userSuggestions?.username}/${userSuggestions?._id}`;
        }}
      >
        <div className="recommended__user--tile--img--container">
          <LazyLoadImage
            src={
              userSuggestions?.profilePicture != ""
                ? `${userSuggestions?.profilePicture}.js?version=${userSuggestions?.profileImgVersion}`
                : logo
            }
            alt="profile__card--img"
            id="profile__card--img"
            effect="blur"
            height={"inherit"}
            width={"inherit"}
          />
        </div>
        <h4>{userSuggestions?.username}</h4>
      </button>
    </>
  );
};
export default RecUsers;
