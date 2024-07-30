import { useContext, useEffect, useState } from "react";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";

type postImgProps = {
  cancel: Function;
  retrievePostImg: (res: string) => void;
};

const PostImgUpload = ({ cancel, retrievePostImg }: postImgProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  const [postImg, setPostImg] = useState<any>();

  //convert profile picture to base64

  const convert = (e: any) => {
    let reader = new FileReader();
    if (e) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setPostImg(reader.result);
      };
    }
  };

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, []);
  return (
    <>
      <div className="full__blur--wrapper">
        <div className="post__img--upload--container">
          <button
            className="cancel__post--img--upload"
            onClick={(e) => {
              e.preventDefault();
              cancel(false);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="post__img--upload--preview--container">
            {postImg != undefined ? (
              <img id="post__img--preview" src={postImg}></img>
            ) : null}

            <label htmlFor="post__img--input" id="custom__post--upload--input">
              <div>
                <i className="fa-solid fa-plus"></i>
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              id="post__img--input"
              onChange={(e) => convert(e)}
              style={{ display: "none" }}
            />
          </div>
          <Button
            content="Add"
            icon={false}
            inactive={postImg != undefined ? !false : false}
            action={retrievePostImg}
            secondAction={cancel}
            optionalValue={postImg}
            secondOptionalValue={false}
          />
        </div>
      </div>
    </>
  );
};
export default PostImgUpload;
