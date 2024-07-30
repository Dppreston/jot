import axios from "axios";
import { useEffect, useState, useContext } from "react";

import { GlobalContext, UserContext } from "../App";

const interactionContent: {
  id: number;
  title?: string;
  icon: string;
  save?: string;
  hidden?: boolean;
}[] = [
  {
    id: 1,
    title: "Comments",
    icon: "fa-regular fa-message",
    hidden: false,
  },
  {
    id: 2,
    title: "Share",
    icon: "fa-solid fa-arrow-up-from-bracket",
    hidden: false,
  },
  {
    id: 3,
    title: "Save",
    icon: "fa-regular fa-bookmark",
    save: "fa-solid fa-bookmark",
    hidden: false,
  },
  {
    id: 4,
    icon: "fa-solid fa-ellipsis",
    hidden: false,
  },
  {
    id: 5,
    title: "Report",
    icon: "fa-regular fa-flag",
    hidden: true,
  },
  {
    id: 6,
    title: "Delete",
    icon: "fa-solid fa-trash",
    hidden: true,
  },
];

const token: string | null = localStorage.getItem("token");

type OptionProps = {
  postId: string | undefined;
  postIdConfirmation: boolean;
  optionFocus: Function;
  postImg?: string;
  deleteConfirm?: (res: boolean) => void;
};

type InteractionProps = {
  postId: string | undefined;
  feedTile?: boolean;
  postImg?: string;
};

export const OptionDropdown = ({
  postIdConfirmation,
  optionFocus,
  postImg,
  postId,
}: OptionProps) => {
  const {
    setConfirmActive,
    setConfirmConditions,
    setReportActive,
    setReportConditions,
  } = useContext<GlobalContext>(UserContext);

  //delete post
  const deletePost = async () => {
    try {
      //remove user Data from post
      await axios.put(`/jot-users?clearPostData=true&postId=${postId}`);

      //get ids to delete

      const getCommentIdsToDelete = await axios.get(
        `/jot-comments?deletePostIdsToDelete=true&postId=${postId}`
      );
      const filteredIds = getCommentIdsToDelete.data.map(
        (el: { _id: string }) => el._id
      );

      //remove likes and dislikes associated with comments associated with post

      if (getCommentIdsToDelete.data) {
        const res = await axios.put(
          `/jot-users?deletedComment=true&userId=${token}&idsToDelete=${filteredIds}`
        );

        //deleteComments associated with post

        if (res.data == true) {
          await axios.put(
            `/jot-comments?removeCommentsFromDeletedPosts=true&postId=${postId}`
          );

          //delete post
          const deleteRes = await axios.put(
            `/jot-posts?deletePost=true&postId=${postId}`
          );

          if (deleteRes) {
            window.location.href = "/home";
            axios.put(`/jot-posts?deletePostImg=true&postImg=${postImg}`);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="option__dropdown">
        <span
          className="report__post"
          onClick={() => {
            optionFocus(false);
            setReportActive(!false);
            setReportConditions({
              reportType: "post",
              reportReferenceId: postId,
            });
          }}
        >
          <i className={interactionContent[4].icon}></i>
          Report
        </span>
        {postIdConfirmation == true ? (
          <span
            className="delete__post"
            onClick={() => {
              optionFocus(false);
              setConfirmActive(!false);
              setConfirmConditions({
                content: "Are you sure you want to delete this post?",
                confirmAction: deletePost,
                cancelAction: setConfirmActive,
              });
            }}
          >
            <i className="fa-solid fa-trash"></i>
            Delete
          </span>
        ) : null}
      </div>
    </>
  );
};

//share dropdown

export const ShareDropdown = ({ shareFocus, postId }: any) => {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <>
      <div
        className="share__dropdown"
        onClick={() => {
          setChecked(!false);
          navigator.clipboard.writeText(
            `${window.location.origin}/post/${postId}`.toString()
          );

          setTimeout(() => {
            shareFocus(false);
          }, 1000);
        }}
      >
        <p id="copy__link">
          Copy Link{" "}
          {checked ? (
            <i className="fa-solid fa-check" id="checkmark"></i>
          ) : null}
        </p>
      </div>
    </>
  );
};

const PostInteractions = ({ postId, feedTile, postImg }: InteractionProps) => {
  const [saveClicked, setSavedClicked] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState([]);
  const [share, setShare] = useState<boolean>(false);
  const [options, setOptions] = useState<boolean>(false);
  const [postIdConfirmation, setPostIdConfirmation] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const { darkActive, loggedin, setLoginActive } =
    useContext<GlobalContext>(UserContext);

  //focus check

  const shareFocus = (focus: boolean) => {
    setShare(focus);
  };
  const optionFocus = (focus: boolean) => {
    setOptions(focus);
  };

  //save functionality

  const saveFunctionality = async () => {
    try {
      const res = await axios.put(
        `/jot-users?save=true&postId=${postId}&userId=${token}`
      );

      await axios.put(
        `/jot-posts?saveUserToPost=true&postId=${postId}&userId=${token}`
      );

      setSavedClicked(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //save check

  const savedCheck = async () => {
    try {
      const res = await axios.get(
        `/jot-users?savedCheck=true&postId=${postId}&userId=${token}`
      );
      setSavedIds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //id confirmation to existing posts

  const confirmedIds = savedIds.find((ids) => {
    return ids == postId;
  });

  const fetchPosterId = async () => {
    try {
      const res = await axios.get(
        `/jot-posts?posterId=true&userId=${token}&postId=${postId}`
      );
      setPostIdConfirmation(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const res = await axios.get(
        `/jot-comments?commentCount=true&postId=${postId}`
      );
      setCommentCount(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (postId != undefined) {
      fetchCommentCount();
    }
  }, [postId]);
  useEffect(() => {
    if (feedTile != undefined) {
      fetchCommentCount();
    }
  }, [feedTile]);

  useEffect(() => {
    loggedin == !false ? savedCheck() : null;
  }, [saveClicked]);

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [[], share, options]);

  return (
    <>
      <div className="post__interactions">
        {interactionContent.map((option) => (
          <button
            className="interaction__option"
            key={option.id}
            onClick={(e) => {
              e.preventDefault();

              if (option.id == 1 && feedTile == true) {
                window.location.href = `${window.location.origin}/post/${postId}`;
              }
              if (option.id == 2) {
                setShare(!false);
              }
              if (option.id != 2) {
                setShare(false);
              }

              if (option.id == 3) {
                if (loggedin == !false) {
                  saveFunctionality();
                  setTimeout(() => {
                    savedCheck();
                  }, 300);
                } else {
                  setLoginActive(!false);
                }
              }

              if (option.id == 4 && loggedin == !false) {
                fetchPosterId();
                setOptions(!false);
              }

              if (option.id != 4) {
                setOptions(false);
              }
            }}
            onBlur={() => {
              setShare(false);
              setOptions(false);
            }}
            style={
              option.hidden == true
                ? { display: "none" }
                : { display: "inherit" }
            }
          >
            <i
              className={
                option.hidden == true ||
                (option.id == 3 && confirmedIds == postId)
                  ? option.save
                  : option.icon
              }
            ></i>{" "}
            <p>{option.hidden == false ? option.title : null}</p>
            {option.id == 2 && share == true ? (
              <ShareDropdown shareFocus={shareFocus} postId={postId} />
            ) : null}
            {option.id == 4 && options == !false ? (
              <OptionDropdown
                postId={postId}
                postIdConfirmation={postIdConfirmation}
                optionFocus={optionFocus}
                postImg={postImg != null ? postImg : undefined}
                // deleteConfirm={deleteConfirm}
              />
            ) : null}
            {option.id == 1 && commentCount != 0 ? (
              <p id="comment__count">{commentCount}</p>
            ) : null}
          </button>
        ))}
      </div>
    </>
  );
};
export default PostInteractions;
