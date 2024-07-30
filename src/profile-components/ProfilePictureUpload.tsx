import profileFiller from "../assets/profile__pic--filler.png";
import { useState } from "react";

type ProfilePictureProps = {
  handleGetProfilePicture?: (img: string | ArrayBuffer | null) => void;
  initialImg?: string;
  initialVersion?: number;
};

const ProfilePictureUpload = ({
  handleGetProfilePicture,
  initialImg,
  initialVersion,
}: ProfilePictureProps) => {
  const [profilePicture, setProfilePicture] = useState<any>();
  const [imgAlert, setImgAlert] = useState<string | undefined>();

  //convert profile picture to base64

  const convert = (e: any) => {
    let reader = new FileReader();
    if (e) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        let sizeinMb = Number(
          (e.target.files[0].size / (1024 * 1024)).toFixed(2)
        );

        if (
          e.target.files[0].type != "image/jpeg" &&
          e.target.files[0].type != "image/png"
        ) {
        }

        if (sizeinMb > 7) {
          setImgAlert("Image is too large");
          setTimeout(() => {
            setImgAlert(undefined);
          }, 2000);
        } else if (
          e.target.files[0].type != "image/jpeg" &&
          e.target.files[0].type != "image/png"
        ) {
          setImgAlert("Image not supported");
          setTimeout(() => {
            setImgAlert(undefined);
          }, 2000);
        } else {
          setProfilePicture(reader.result);
          handleGetProfilePicture!(reader.result);
        }
      };
    }
  };

  return (
    <>
      <div className="upload__profile--picture--container">
        {imgAlert != undefined ? (
          <div className="img__alert--container">
            <h4>{imgAlert}</h4>
          </div>
        ) : null}

        <div className="profile__picture--wrapper">
          <img
            src={
              profilePicture! != undefined
                ? profilePicture
                : initialVersion != null
                ? `${initialImg}.js?=version${initialVersion}`
                : profileFiller
            }
            alt="profile--picure"
            id="signup__profile--picture"
            style={
              profilePicture! != undefined ||
              (initialImg != undefined && initialVersion != null)
                ? { position: "absolute", top: "0px" }
                : undefined
            }
          />
        </div>
        <label
          htmlFor="profile__picture--input"
          className="custom__profile--img--input"
        >
          <i className="fa-solid fa-plus"></i>
        </label>
        <input
          accept="image/*"
          type="file"
          id="profile__picture--input"
          onChange={(e) => {
            convert(e);
          }}
          onClick={() => setProfilePicture(undefined)}
        />
      </div>
    </>
  );
};
export default ProfilePictureUpload;
