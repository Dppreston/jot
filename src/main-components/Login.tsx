import logo from "../assets/jot-logo.png";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../loaders/Loader";
import categories from "../staticdata/Categories";
import ProfilePictureUpload from "../profile-components/ProfilePictureUpload";
import InputCounter from "../secondary-components/InputCounter";
import PasswordCheck from "../secondary-components/PasswordCheck";
import check from "../assets/small-loader-done.mp4";
import { GlobalContext, UserContext } from "../App";
import Button from "../buttons/ButtonMain";

const selectedCategoriesArr: number[] = [];

type Cat = {
  id: number;
};

type BioProps = {
  setPage: Function;
  receiveBio: (bio: string) => void;
};

type HandleSignup = {
  handlePostSignup: () => void;
  recieveCategories: Function;
};
type RecievedUser = {
  parentUserId: string;
  username: string;
  password: string;
  _id: string;
};

type SignupProps = {
  returnToLogin: Function;
};

export const Bio = ({ setPage, receiveBio }: BioProps) => {
  const [bioLength, setBioLength] = useState<number>(0);

  return (
    <>
      <form className="signup__login--inner signup__only">
        <div className="signup__bio--container">
          <div className="signup__bio--title--container">
            <h3>Tell us a little about yourself</h3>
            <h4>Other users will see this</h4>
          </div>
          <div className="signup__bio--input--wrapper">
            <textarea
              name="singup__bio"
              id="signup__bio"
              onChange={(e) => {
                setBioLength(e.currentTarget.value.length);
                receiveBio(e.currentTarget.value);
              }}
              maxLength={250}
            ></textarea>
            <InputCounter propLength={bioLength} />
          </div>
          <Button
            action={setPage}
            optionalValue={2}
            content={"fa-solid fa-arrow-right"}
            icon={true}
            inactive={!false}
          />
        </div>
      </form>
    </>
  );
};

export const FavoriteCategories = ({
  handlePostSignup,
  recieveCategories,
}: HandleSignup) => {
  const [counter, setCounter] = useState<number>(0);
  const [inactive, setInactive] = useState<boolean>(false);

  const handleSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    cat: Cat
  ) => {
    if (
      !selectedCategoriesArr.includes(cat.id) &&
      selectedCategoriesArr.length < 8
    ) {
      selectedCategoriesArr.push(cat.id);
      setCounter(selectedCategoriesArr.length);
      e.currentTarget!.classList.add("tile__selected");
    } else if (selectedCategoriesArr.includes(cat.id)) {
      selectedCategoriesArr.splice(selectedCategoriesArr.indexOf(cat.id), 1);
      setCounter(selectedCategoriesArr.length);
      e.currentTarget.classList.remove("tile__selected");
    }
  };

  //condition check

  const selectionConditionCheck = () => {
    if (selectedCategoriesArr.length >= 3) {
      setInactive(!false);
    } else {
      setInactive(false);
    }
  };

  return (
    <>
      <div className="signup__login--inner signup__categories">
        <p className="favorites__title">Pick at least 3 categories you like</p>
        <div className="favorite__cateogries--container">
          {categories.map((cat) => (
            <button
              className="favorite__category--tile"
              key={cat.id}
              onClick={(e) => {
                handleSelected(e, cat);
                recieveCategories(selectedCategoriesArr);
                selectionConditionCheck();
              }}
            >
              <i className={cat.icon}></i>
              <h5>{cat.title}</h5>
            </button>
          ))}
        </div>
        <div className="favorites__bottom">
          <p
            className="favorites__counter"
            style={
              selectedCategoriesArr.length == 8 ? { color: "red" } : undefined
            }
          >
            {" "}
            {counter} / 8 Categories
          </p>

          <Button
            action={handlePostSignup}
            content={"Submit"}
            inactive={inactive}
          />
        </div>
      </div>
    </>
  );
};

export const SignupForm = ({ returnToLogin }: SignupProps) => {
  const [first, setFirst] = useState<string>("");
  const [last, setLast] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [userCheckRes, setUserCheckRes] = useState<boolean>(false);
  const [emailCheckRes, setEmailCheckRes] = useState<boolean>();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [passwordDropdown, setPasswordDropdown] = useState<boolean>(false);
  const [passwordUppercaseCheck, setPasswordUppercaseCheck] =
    useState<boolean>(false);
  const [specialCharCheck, setSpecialCharCheck] = useState<boolean>(false);
  const [numberCheck, setNumberCheck] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>();
  const [profilePictureData, setProfilePictureData] = useState<
    string | ArrayBuffer | null
  >();
  const { page, setPage, setPasswordRecovery } =
    useContext<GlobalContext>(UserContext);
  const [bio, setBio] = useState<string>("");
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [conditionActive, setConditionActive] = useState<boolean>(false);

  //recieve categories

  const receiveCategories = (categories: number[]) => {
    setFavorites(categories);
  };

  //receive bio

  const recieveBio = (bio: string) => {
    setBio(bio);
  };

  //new account signup data

  let signupData = {
    username: username,
    favoriteCategories: favorites,
    bioContent: bio,
    profilePicture: profilePictureData,
  };

  //post new account

  const handlePostSignup = async () => {
    setIsLoading(!false);
    setLoadingState(false);
    try {
      const res = await axios.post(
        "http://localhost:1000/jot-users?createAccount=true",
        signupData
      );

      if (res.data == true) {
        //retrieve username for new userId

        const newUserIdRes = await axios.get(
          `http://localhost:1000/jot-users?usernameForSensitive=true&username=${username}`
        );

        if (newUserIdRes.data.length > 0) {
          //user sensitive info post

          const userSensitiveData = {
            first: first,
            last: last,
            email: email,
            password: password,
            parentUserId: newUserIdRes.data[0]._id,
            username: username,
          };

          const sensitiveRes = await axios.post(
            "http://localhost:1000/jot-user-sensitive&initialSignup=true",
            userSensitiveData
          );

          // user preference post

          const preferenceData = {
            parentUserId: newUserIdRes.data[0]._id,
            darkMode: false,
            privateProfile: false,
          };

          const preferenceRes = await axios.post(
            `http://localhost:1000/jot-user-preferences`,
            preferenceData
          );

          if (sensitiveRes.data == true && preferenceRes.data == true) {
            setTimeout(() => {
              setLoadingState(!false);
            }, 2500);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetProfilePicture = (img: string | ArrayBuffer | null) => {
    setProfilePictureData(img);
  };

  //username check

  const usernameCheck = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-users?userCheck=true&userCheckData=${signupData.username}`
      );

      setUserCheckRes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //email check

  const emailCheck = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-user-sensitive?emailCheck=true&emailCheckData=${email}`
      );

      setEmailCheckRes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //password check

  const passwordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialCharFormat = /[ !@#$%^&*? ]/;
    const numberFormat = /[ 1234567890 ]/;

    //uppercase Check
    const uppercaseCheck =
      e.currentTarget.value !== e.currentTarget.value.toLowerCase();
    if (uppercaseCheck == !false) {
      setPasswordUppercaseCheck(!false);
    } else {
      setPasswordUppercaseCheck(false);
    }

    //special character check
    const specialCharacterCheck = specialCharFormat.test(e.currentTarget.value);
    if (specialCharacterCheck == !false) {
      setSpecialCharCheck(!false);
    } else {
      setSpecialCharCheck(false);
    }

    //number check

    const numberCheck = numberFormat.test(e.currentTarget.value);
    if (numberCheck == !false) {
      setNumberCheck(!false);
    } else {
      setNumberCheck(false);
    }
  };

  return (
    <>
      {isloading == !false ? <Loader loadingState={loadingState} /> : null}
      <div className="signup__logo--container">
        <div className="signup__back--wrapper">
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => {
              if (page != 0) {
                setPage(page - 1);
              } else {
                returnToLogin(false);
              }
            }}
          ></i>
        </div>
        <div className="signup__marker--wrapper">
          {page == 0 ? (
            <>
              <i className="signup__marker--1 fa-solid fa-circle"></i>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
            </>
          ) : page == 1 ? (
            <>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
              <i className="signup__marker--1 fa-solid fa-circle"></i>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
            </>
          ) : page == 2 ? (
            <>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
              <i className="signup__marker--1 fa-regular fa-circle"></i>
              <i className="signup__marker--1 fa-solid fa-circle"></i>
            </>
          ) : null}
        </div>

        <img
          src={logo}
          alt="jot-logo"
          id="jot__signup--logo"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      {page == 0 ? (
        <form className="signup__login--inner">
          <div className="signup__lower">
            <ProfilePictureUpload
              handleGetProfilePicture={handleGetProfilePicture}
            />
            <div className="signup__names--wrapper">
              <label htmlFor="first-name" className="signup__labels">
                <span>
                  First{" "}
                  {first != "" ? (
                    <video
                      src={check}
                      id="signup__info--check--alt"
                      autoPlay
                      muted
                    ></video>
                  ) : null}
                </span>
                <input
                  type="text"
                  className="signup__inputs"
                  required
                  onChange={(e) => {
                    setFirst(e.currentTarget.value);
                    e.currentTarget.style.textTransform = "capitalize";
                  }}
                  id="signup__first"
                  defaultValue={first}
                />
              </label>
              <label htmlFor="last-name" className="signup__labels">
                <span>
                  Last{" "}
                  {last != "" ? (
                    <video
                      src={check}
                      id="signup__info--check--alt"
                      autoPlay
                      muted
                    ></video>
                  ) : null}
                </span>
                <input
                  type="text"
                  className="signup__inputs"
                  required
                  onChange={(e) => {
                    setLast(e.currentTarget.value);
                    e.currentTarget.style.textTransform = "capitalize";
                  }}
                  id="signup__last"
                  defaultValue={last}
                />
              </label>
            </div>
            <label
              htmlFor="username"
              className="signup__labels"
              onFocus={() => {
                setConditionActive(!false);
              }}
              onBlur={() => {
                setConditionActive(false);
              }}
            >
              <span>
                Username{" "}
                {userCheckRes == !false ? (
                  <h4
                    className="signup__found--alert"
                    style={{ color: "var(--input-error)" }}
                  >
                    Username Taken
                  </h4>
                ) : username != "" && userCheckRes == false ? (
                  <video
                    src={check}
                    id="signup__info--check--alt"
                    autoPlay
                    muted
                  ></video>
                ) : null}
                {conditionActive == !false ? (
                  <h5>{`${username.length} / 12`}</h5>
                ) : null}
              </span>
              <input
                type="text"
                className="signup__inputs"
                required
                onChange={(e) => {
                  setUsername(e.currentTarget.value);
                }}
                onBlur={() => {
                  usernameCheck();
                }}
                defaultValue={username}
                maxLength={12}
              />
            </label>
            <label htmlFor="email" className="signup__labels">
              <span>
                Email{" "}
                {emailCheckRes == false && email != "" ? (
                  <h4 className="signup__found--alert">
                    Email Found. Recover{" "}
                    {
                      <a
                        onClick={() => {
                          setPasswordRecovery(!false);
                        }}
                      >
                        here.
                      </a>
                    }
                  </h4>
                ) : email.includes("@") &&
                  emailCheckRes == !false &&
                  email != "" ? (
                  <video
                    src={check}
                    id="signup__info--check--alt"
                    autoPlay
                    muted
                  ></video>
                ) : !email.includes("@") && email != "" ? (
                  <p
                    className="signup__found--alert"
                    style={{ color: "var(--input-error)" }}
                  >
                    Please Enter a vaild Email
                  </p>
                ) : null}
              </span>
              <input
                type="email"
                className="signup__inputs"
                required
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                defaultValue={email}
                onBlur={() => {
                  emailCheck();
                }}
              />
            </label>
            <label htmlFor="password" className="signup__labels">
              Password
              <input
                type="password"
                className="signup__inputs"
                required
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                  passwordCheck(e);
                }}
                minLength={6}
                onFocus={() => setPasswordDropdown(!false)}
                onBlur={() => {
                  setPasswordDropdown(false);
                }}
                defaultValue={password}
              />
              {passwordDropdown == !false ? (
                <PasswordCheck
                  password={password}
                  passwordUppercaseCheck={passwordUppercaseCheck}
                  numberCheck={numberCheck}
                  specialCharCheck={specialCharCheck}
                />
              ) : password.length >= 6 &&
                specialCharCheck == !false &&
                numberCheck == !false &&
                passwordUppercaseCheck == !false ? (
                <video
                  src={check}
                  id="signup__info--check--alt"
                  autoPlay
                  muted
                ></video>
              ) : null}
            </label>
            <label htmlFor="confirm-password" className="signup__labels">
              <span>
                Confirm Password{" "}
                {passwordMatch == !false ? (
                  <p className="signup__found--alert" style={{ color: "red" }}>
                    Check Confirm
                  </p>
                ) : password != "" && confirm != "" && password == confirm ? (
                  <video
                    src={check}
                    id="signup__info--check--alt"
                    autoPlay
                    muted
                  ></video>
                ) : null}
              </span>
              <input
                type="password"
                className="signup__inputs"
                required
                onChange={(e) => {
                  setConfirm(e.currentTarget.value);
                }}
                defaultValue={confirm}
                onBlur={() => {
                  if (password != confirm) {
                    setPasswordMatch(!false);
                  } else {
                    setPasswordMatch(false);
                  }
                }}
              />
            </label>
            {userCheckRes == false &&
            passwordUppercaseCheck != false &&
            specialCharCheck != false &&
            numberCheck != false &&
            emailCheckRes != false &&
            email.includes("@") &&
            username != "" &&
            first != "" &&
            last != "" &&
            password == confirm ? (
              <Button
                action={setPage}
                optionalValue={1}
                content={"fa-solid fa-arrow-right"}
                icon={true}
                inactive={!false}
              />
            ) : (
              <Button
                inactive={false}
                action={setPage}
                icon={true}
                content={"fa-solid fa-arrow-right"}
              />
            )}
          </div>
        </form>
      ) : page == 1 ? (
        <Bio setPage={setPage} receiveBio={recieveBio} />
      ) : page == 2 ? (
        <FavoriteCategories
          handlePostSignup={handlePostSignup}
          recieveCategories={receiveCategories}
        />
      ) : null}
    </>
  );
};

export const LoginForm = () => {
  const [loginData, setLoginData] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [userData, setUserData] = useState<RecievedUser[] | string>([]);
  const [userError, setUserError] = useState<string | JSX.Element>("");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [loadingRedirect, setLoadingRedirect] = useState<string>();
  const { setPasswordRecovery, mobileMedia } =
    useContext<GlobalContext>(UserContext);

  //login request

  const handleLoginRequest = async () => {
    setIsLoading(!false);
    setLoadingState(false);
    try {
      const emailRes = await axios.get(
        `http://localhost:1000/jot-user-sensitive?loginCheckEmail=true&email=${loginData}&password=${loginPassword}`
      );

      if (emailRes.data.length == 0) {
        const usernameRes = await axios.get(
          `http://localhost:1000/jot-user-sensitive?loginCheckUsername=true&username=${loginData}&password=${loginPassword}`
        );

        if (usernameRes.data == "") {
          setTimeout(() => {
            setUserError(
              <p style={{ color: "red" }}>No user found. Please try again.</p>
            );
            setIsLoading(false);
            setTimeout(() => {
              setUserError("");
            }, 2000);
          }, 2000);

          setLoginPassword("");
          setLoginData("");
        } else {
          setTimeout(() => {
            setLoadingState(!false);
            setUserData(usernameRes.data);
          }, 2000);
        }
      } else {
        if (emailRes.data == "") {
          setTimeout(() => {
            setUserError(
              <p style={{ color: "red" }}>No user found. Please try again.</p>
            );
            setIsLoading(false);
            setTimeout(() => {
              setUserError("");
            }, 2000);
          }, 2000);

          setLoginPassword("");
          setLoginData("");
        } else {
          setTimeout(() => {
            setLoadingState(!false);
            setUserData(emailRes.data);
          }, 2000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //set token on login

  if (userData instanceof Array) {
    userData?.map((user) => {
      localStorage.setItem("token", user.parentUserId || user._id);
    });
  }

  return (
    <>
      {isloading == !false ? (
        <Loader
          loadingState={loadingState}
          redirect={loadingRedirect != undefined ? loadingRedirect : undefined}
        />
      ) : null}
      <div className="signup__login--inner login__inner--only">
        <div className="login__upper">
          <img src={logo} alt="jot-logo" id="jot__login--logo" />
          <div className="login__upper--content--wrapper">
            <h2>
              Welcome to{" "}
              <span
                style={{
                  fontFamily: `"Lobster", sans-serif`,
                  fontSize: mobileMedia == false ? "2rem" : "1.5rem",
                  color: "var(--accent)",
                }}
              >
                Jot
              </span>
            </h2>
            <h5>A simple, modern blog</h5>
          </div>
        </div>
        <form className="login__lower">
          {userError}
          <label htmlFor="username" className="login__labels">
            Username or Email
            <input
              type="text"
              className="login__inputs"
              required
              onChange={(e) => {
                setLoginData(e.currentTarget.value);
              }}
              value={loginData}
            />
            {loginData != "" ? (
              <video
                src={check}
                className="login__info--check--alt"
                autoPlay
                muted
              ></video>
            ) : null}
          </label>
          <label htmlFor="password" className="login__labels">
            <div
              className="password__login--label--wrapper"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Password
              <h5
                className="recover__selector"
                onClick={() => {
                  setPasswordRecovery(!false);
                }}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Not Sure?
              </h5>
            </div>

            <input
              type="password"
              className="login__inputs"
              required
              onChange={(e) => {
                setLoginPassword(e.currentTarget.value);
              }}
              value={loginPassword}
            />
            {loginPassword != "" ? (
              <video
                src={check}
                className="login__info--check--alt"
                autoPlay
                muted
              ></video>
            ) : null}
          </label>
          <Button
            action={handleLoginRequest}
            content={"Login"}
            inactive={!false}
          />
        </form>
      </div>
    </>
  );
};

const Login = () => {
  const { setLoginActive, signup, setSignup } =
    useContext<GlobalContext>(UserContext);

  return (
    <>
      <div className="full__blur--wrapper">
        {signup == false ? (
          <div
            className="login__wrapper login__only "
            style={{
              height: "400px",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              content="fa-solid fa-xmark"
              icon={!false}
              inactive={!false}
              action={setLoginActive}
              optionalValue={false}
            />
            <LoginForm />
            <h5 className="signup__selector">
              Dont have an account?{" "}
              <span
                id="signup"
                onClick={() => {
                  setSignup(!false);
                }}
              >
                Sign Up
              </span>
            </h5>
          </div>
        ) : (
          <div>
            <div className="login__wrapper">
              <SignupForm returnToLogin={setSignup} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Login;
