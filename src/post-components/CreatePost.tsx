import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Loader from "../loaders/Loader";
import categories from "../staticdata/Categories";
import Button from "../buttons/ButtonMain";
import PostImgUpload from "./PostImgUpload";
import PostImg from "./PostImg";
import { GlobalContext, UserContext } from "../App";
import { CategoryDropdown } from "../sort-components/FeedSort";
import InputCounter from "../secondary-components/InputCounter";
import InformationPopup from "../popup-components/InformationPopup";
import InfoData from "../staticdata/InfoData";

const token: string | null = localStorage.getItem("token");

const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [postBody, setPostBody] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inactive, setInactive] = useState<boolean>(false);
  const [addImgActive, setAddImgActive] = useState<boolean>(false);
  const [postImg, setPostImg] = useState<string | undefined>();
  const [previewFull, setPreviewFull] = useState<boolean>(false);
  const { darkActive, setCreateActive } =
    useContext<GlobalContext>(UserContext);
  const [categoryDropdownActive, setCategoryDropdownActive] =
    useState<boolean>(false);
  const [chosenCategory, setChosenCategory] = useState<string>("");
  const [wordLimit, setWordLimit] = useState<boolean>(false);
  const [postInfoActive, setPostInfoActive] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const postData = {
    category: chosenCategory,
    title: title,
    headline: headline,
    postBody: postBody,
    userId: userId,
    postImg: postImg != undefined ? postImg : "",
  };

  //create post POST
  const addPost = async () => {
    setIsLoading(!false);

    try {
      const res = await axios.post(
        "http://localhost:1000/jot-posts?createPost=true",
        postData
      );
      if (res.data) {
        setTimeout(() => {
          setLoadingState(!false);
        }, 2000);
      }
    } catch (err) {
      console.log();
    }
  };

  const categorySelection = (selectionTitle: string) => {
    setChosenCategory(selectionTitle);
    setCategoryDropdownActive(false);
  };

  // create conditions

  const conditions = () => {
    if (
      title != "" &&
      headline != "" &&
      postBody != "" &&
      chosenCategory != ""
    ) {
      setInactive(!false);
    } else {
      setInactive(false);
    }
  };

  //retrieve postImg

  const retrievePostImg = (res: string) => {
    setPostImg(res);
  };

  useEffect(() => {
    setUserId(token!);
    darkActive == !false ? window.darkMode() : null;
  }, []);

  return (
    <>
      <div className="full__blur--wrapper">
        {isLoading == !false ? <Loader loadingState={loadingState} /> : null}
        <div
          className="create__post--inner"
          onClick={() => {
            if (categoryDropdownActive == !false) {
              setCategoryDropdownActive(false);
            }
          }}
        >
          <div className="create__post--upper">
            <h3>Create A Post</h3>
            <Button
              content="fa-solid fa-xmark"
              icon={!false}
              action={setCreateActive}
              optionalValue={false}
              inactive={!false}
            />
          </div>
          <form className="create__post--form" onBlur={() => conditions()}>
            <section className="create__post--middle">
              <div
                className="create__style--category"
                style={
                  darkActive == !false
                    ? { background: "var(--hover-DM)" }
                    : undefined
                }
              >
                <h4> What category are you posting in?</h4>
                <section
                  className="post__category--container"
                  onBlur={(e) => {
                    if (chosenCategory == null || "") {
                      e.currentTarget.style.border = "1px solid red";
                    }
                  }}
                >
                  <button
                    className="create__post--category--selection--btn"
                    style={
                      darkActive == !false
                        ? { background: "var(--hover-DM" }
                        : undefined
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (categoryDropdownActive == false) {
                        setCategoryDropdownActive(!false);
                      } else {
                        setCategoryDropdownActive(false);
                      }
                    }}
                  >
                    {chosenCategory == "" ? (
                      <div className="select__category--info--wrapper">
                        <h4>Select a Category</h4>

                        <i
                          className={
                            categoryDropdownActive == false
                              ? "fa-solid fa-chevron-right"
                              : "fa-solid fa-chevron-down"
                          }
                          style={
                            darkActive == !false
                              ? { color: "var(--white-DM)" }
                              : undefined
                          }
                        ></i>
                      </div>
                    ) : (
                      categories
                        .filter((data) => data.title == chosenCategory)
                        .map((el) => (
                          <div
                            className="select__category--info--wrapper"
                            style={
                              darkActive == !false
                                ? { color: "var(--white-DM)" }
                                : undefined
                            }
                            key={el.id}
                          >
                            <i
                              className={el.icon}
                              style={{ fontSize: "13px" }}
                            ></i>
                            <h4>{el.title}</h4>
                          </div>
                        ))
                    )}
                  </button>
                  {categoryDropdownActive == !false ? (
                    <CategoryDropdown
                      categoryTitleSelection={categorySelection}
                    />
                  ) : null}
                </section>
              </div>
              <div className="create__style--wrapper">
                <h4>Create a Title</h4>
                <input
                  className="post__title"
                  placeholder="A unique title for your post"
                  onChange={(e) => {
                    setTitle(e.currentTarget.value);
                  }}
                  onBlur={(e) => {
                    if (title == "") {
                      e.currentTarget.style.border =
                        "1px solid var(--input-error)";
                    } else {
                      e.currentTarget.style.background = "undefined";
                      {
                        darkActive == !false
                          ? (e.currentTarget.style.border =
                              " var(--border-on-hover-DM)")
                          : "var(--border)";
                      }
                    }
                  }}
                />{" "}
              </div>
              <div className="create__style--wrapper">
                <h4>Create a Headline</h4>
                <input
                  className="post__headline"
                  placeholder="Make readers want to engage"
                  onChange={(e) => {
                    setHeadline(e.currentTarget.value);
                  }}
                  onBlur={(e) => {
                    if (headline == "") {
                      e.currentTarget.style.border =
                        "1px solid var(--input-error)";
                    } else {
                      e.currentTarget.style.background = "undefined";
                      {
                        darkActive == !false
                          ? (e.currentTarget.style.border =
                              " var(--border-on-hover-DM)")
                          : "var(--border)";
                      }
                    }
                  }}
                />
              </div>
              {postImg == undefined ? (
                <div className="create__img--upload--wrapper">
                  <h4>
                    Add an Img
                    <span>
                      <p style={{ fontSize: "var(--p--subtitle)" }}>
                        (optional)
                      </p>
                    </span>
                  </h4>
                  <Button
                    content="fa-solid fa-plus"
                    icon={!false}
                    inactive={!false}
                    action={setAddImgActive}
                    optionalValue={!false}
                  />
                </div>
              ) : (
                <PostImg
                  setPostImg={setPostImg}
                  postImg={postImg}
                  previewFull={previewFull}
                  setPreviewFull={setPreviewFull}
                  create={!false}
                />
              )}

              {addImgActive == !false ? (
                <PostImgUpload
                  cancel={setAddImgActive}
                  retrievePostImg={retrievePostImg}
                />
              ) : null}
            </section>
            <section className="create__post--bottom">
              <div className="create__style--wrapper" id="post__content--label">
                <div className="post__content--info--wrapper">
                  <h4>Post Content</h4>
                  <i
                    className="fa-regular fa-circle-question"
                    onMouseEnter={() => setPostInfoActive(!false)}
                    onMouseLeave={() => setPostInfoActive(false)}
                  ></i>
                  {postInfoActive == !false ? (
                    <InformationPopup
                      data={InfoData.find((el) => el.type == "createPost")}
                    />
                  ) : null}
                </div>
                <div className="post__input--wrapper">
                  <textarea
                    className="post__content"
                    placeholder="Put your thoughts here"
                    onChange={(e) => {
                      setPostBody(e.currentTarget.value);
                      if (e.currentTarget.value.split(" ").length == 500) {
                        setWordLimit(!false);
                      } else {
                        setWordLimit(false);
                      }
                    }}
                    maxLength={
                      wordLimit == !false ? postBody.length : undefined
                    }
                    onBlur={(e) => {
                      if (postBody == "") {
                        e.currentTarget.style.border =
                          "1px solid var(--input-error)";
                      } else {
                        e.currentTarget.style.background = "undefined";
                        {
                          darkActive == !false
                            ? (e.currentTarget.style.border =
                                " var(--border-on-hover-DM)")
                            : "var(--border)";
                        }
                      }
                    }}
                  />
                  <InputCounter
                    createPostWordCount={postBody.split(" ").length}
                  />
                </div>
              </div>
              <Button
                content={"Create Post"}
                action={addPost}
                inactive={inactive}
              />
            </section>
          </form>
        </div>
      </div>
    </>
  );
};
export default CreatePost;
