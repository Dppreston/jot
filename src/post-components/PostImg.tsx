import { useContext, useEffect } from "react";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";

type PostImgProps = {
  postImg?: string;
  previewFull: boolean;
  setPreviewFull: Function;
  setPostImg?: Function;
  post?: boolean;
  create?: boolean;
  postFinal?: boolean;
};

const PostImg = ({
  postImg,
  previewFull,
  setPreviewFull,
  setPostImg,
  post,
  create,
  postFinal,
}: PostImgProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  });
  return (
    <>
      <div
        className="create__post--img--preview--container"
        style={!create ? { width: "98%" } : undefined}
      >
        {create == !false ? (
          <button
            className="cancel__post--img"
            onClick={(e) => {
              e.preventDefault();
              setPostImg!(undefined);
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        ) : null}

        {postImg != undefined ? (
          <img
            id="create__post--img--preview"
            src={postImg}
            style={
              previewFull == !false ? { height: "100%" } : { height: "200px" }
            }
          ></img>
        ) : null}
        {postImg != undefined ? (
          <div
            className="post__img--preview--blur"
            style={previewFull == !false ? { background: "none" } : undefined}
          >
            {previewFull != !false ? (
              <Button
                content="See Full"
                inactive={post == !false ? false : !false}
                action={setPreviewFull}
                optionalValue={!false}
              />
            ) : (
              <Button
                content="Collapse"
                action={setPreviewFull}
                optionalValue={false}
                inactive={!false}
              />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
export default PostImg;
