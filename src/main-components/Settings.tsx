import { useState, useEffect, useContext } from "react";
import axios from "axios";
import categories from "../staticdata/Categories";
import Button from "../buttons/ButtonMain";
import Toggle from "../buttons/Toggle";
import Input from "../buttons/Input";
import PasswordCheck from "../secondary-components/PasswordCheck";
import ProfilePictureUpload from "../profile-components/ProfilePictureUpload";
import smallLoader from "../assets/small--loader.gif";
import loaderDone from "../assets/small-loader-done.mp4";
import InformationPopup from "../popup-components/InformationPopup";
import { GlobalContext, UserContext } from "../App";
import InfoData from "../staticdata/InfoData";

const token: string | null = localStorage.getItem(`token`);
type SettingsProps = {
  selection: number;
  profileSettingsData: {
    _id: string;
    favoriteCategories: number[];
    bio: string;
    username: string;
    profileImgVersion: number;
    profilePicture: string;
  };
  preferenceData: {
    _id: string;
    parentUserId: string;
    darkMode: boolean;
    privateProfile: boolean;
  };
};

type AccountDataProps = {
  selection: number;
  accountData: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  username: string;
};
type PreferenceProps = {
  preferenceData: {
    _id: string;
    parentUserId: string;
    darkMode: boolean;
    privateProfile: boolean;
  };
  selection: number;
};

export const ProfileSettings = ({
  selection,
  profileSettingsData,
  preferenceData,
}: SettingsProps) => {
  const [profilePicChanged, setProfilePicChanged] = useState<boolean>(false);
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState<
    string | ArrayBuffer
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const {
    darkActive,
    setUserFavoritesForUpdate,
    setChangeFavoritesActive,
    setBioActive,
    setExistingBio,
  } = useContext<GlobalContext>(UserContext);
  const [privateInfoActive, setPrivateInfoActive] = useState<boolean>(false);

  //update private profile

  const updatePrivateProfile = async (active: boolean) => {
    await axios.put(
      `/jot-user-preferences?privateProfile=true&userId=${token}&currentState=${active}`
    );
  };

  //upload // edit profile picture

  const handleGetProfilePicture = (img: string | ArrayBuffer | null) => {
    if (img) {
      setProfilePicChanged(!false);
      setUpdatedProfilePicture(img);
    }
  };

  const updateProfilePicture = async () => {
    let body = {
      pic: updatedProfilePicture,
    };
    setLoading(!false);
    const res = await axios.post(
      `/jot-users?updateProfilePicture=true&picUsername=${profileSettingsData.username}&userId=${token}`,
      body
    );

    console.log(res.data);

    if (res.data[0] == true) {
      await axios.put(
        `/jot-users?versionUpdate=true&userId=${token}&version=${res.data[1]}`
      );
      setLoading(false);
      setLoadingDone(!false);
    }
  };

  //profile settings options

  const profileSetingsOptions: {
    id: number;
    type: string;
    settings: {
      id: number;
      title: string;
      content: string | any;
      array?: boolean;
      action?: Function;
      optionalValue?: boolean | string;
      secondAction?: Function;
      secondOptionalValue?: number[] | string;
      layout: string;
      input: string;
      optionalContent?: string;
      toggleState?: boolean;
      darkMode?: boolean;
      infoState?: boolean;
    }[];
  }[] = [
    {
      id: 1,
      type: "Profile",
      settings: [
        {
          id: 1.2,
          title: "private profile",
          layout: "row",
          content: "",
          array: false,
          input: "toggle",
          action: updatePrivateProfile,
          toggleState: preferenceData.privateProfile,
          infoState: !false,
        },
        {
          id: 1.3,
          title: "update bio",
          layout: "col",
          content: profileSettingsData.bio,
          array: false,
          action: setBioActive,
          optionalValue: !false,
          secondAction: setExistingBio,
          secondOptionalValue: profileSettingsData.bio,
          input: "edit",
          darkMode: darkActive,
        },
        {
          id: 1.4,
          title: "update favorites",
          layout: "col",
          content: categories.filter((el) =>
            profileSettingsData.favoriteCategories.some((data) => el.id == data)
          ),
          array: !false,
          action: setChangeFavoritesActive,
          secondAction: setUserFavoritesForUpdate,
          secondOptionalValue: profileSettingsData.favoriteCategories,
          optionalValue: !false,
          input: "edit",
          darkMode: darkActive,
        },
      ],
    },
  ];

  return (
    <>
      <h4>Update Your Profile Picture</h4>
      <div
        className="settings__tile update__profile--pic--setting--tile"
        style={{
          border: "none",
          borderBottom: "var(--border)",
          borderRadius: "0",
        }}
      >
        <div className="update__profile--picture--container">
          <ProfilePictureUpload
            initialImg={profileSettingsData.profilePicture}
            initialVersion={profileSettingsData.profileImgVersion}
            handleGetProfilePicture={handleGetProfilePicture}
          />
        </div>
        {loading == false && loadingDone == false ? (
          <Button
            content="fa-solid fa-check"
            optionalValue={"Save"}
            icon={!false}
            inactive={profilePicChanged}
            action={updateProfilePicture}
          />
        ) : null}
        {loading == !false ? (
          <img id="settings__small--loader" src={smallLoader}></img>
        ) : loading == false && loadingDone == !false ? (
          <video
            id="settings__loader--complete"
            src={loaderDone}
            onEnded={() => window.location.reload()}
            autoPlay
            muted
          />
        ) : null}
      </div>
      {profileSetingsOptions
        .filter((el) => el.id == selection)
        .find((sub) => sub)
        ?.settings.map((data) => (
          <div
            className="settings__tile"
            key={data.id}
            style={
              data.layout == "col"
                ? { flexDirection: "column" }
                : data.layout == "row"
                ? { flexDirection: "row", border: "none" }
                : undefined
            }
          >
            <div
              className="settings__tile--top"
              style={
                data.layout == "row"
                  ? {
                      width: "100%",
                      background: "none",
                      borderBottom: "var(--border)",
                      paddingBottom: "10px",
                    }
                  : undefined || data.darkMode == !false
                  ? { background: "var(--hover-DM)" }
                  : undefined
              }
            >
              <h4 className="settings__tile--title">{data.title}</h4>
              {data.infoState ? (
                <div className="private__profile--info--container">
                  <i
                    className="fa-regular fa-circle-question"
                    onClick={() => {
                      if (privateInfoActive == false) {
                        setPrivateInfoActive(!false);
                      } else {
                        setPrivateInfoActive(false);
                      }
                    }}
                  ></i>
                  {privateInfoActive == !false ? (
                    <InformationPopup
                      data={InfoData.find((el) => el.type == "privateProfile")}
                    />
                  ) : null}
                </div>
              ) : null}

              {data.optionalContent != "" ? (
                <p className="toggle__support--content">
                  {data.optionalContent}
                </p>
              ) : null}
              {data.input == "edit" ? (
                <Button
                  content={"fa-regular fa-pen-to-square"}
                  icon={true}
                  inactive={!false}
                  action={data.action}
                  optionalValue={data.optionalValue}
                  secondAction={
                    data.secondAction != undefined
                      ? data.secondAction
                      : undefined
                  }
                  secondOptionalValue={
                    data.secondOptionalValue != undefined
                      ? data.secondOptionalValue
                      : undefined
                  }
                />
              ) : (
                <Toggle action={data.action} toggleState={data.toggleState} />
              )}
            </div>
            <div
              className="settings__tile--bottom"
              style={data.layout == "row" ? { display: "none" } : undefined}
            >
              {data.array == true ? (
                data.content.map(
                  (el: { id: number; icon: string; title: string }) => (
                    <div key={el.id} className="post__category--tile">
                      <i className={el.icon}></i> <p>{el.title}</p>
                    </div>
                  )
                )
              ) : (
                <p>{data.content}</p>
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export const AccountSettings = ({
  selection,
  accountData,
  username,
}: AccountDataProps) => {
  const [firstInputInactive, setFirstInputInactive] = useState<boolean>(false);
  const [lastInputInactive, setLastInputInactive] = useState<boolean>(false);
  const [emailInputInactive, setEmailInputInactive] = useState<boolean>(false);
  const [passwordInputInactive, setPasswordInputInactive] =
    useState<boolean>(false);
  const [passwordDataOld, setPasswordDataOld] = useState<string>("");
  const [passwordDataNew, setPasswordDataNew] = useState<string>("");
  const [passwordDataConfirm, setPasswordDataConfirm] = useState<string>("");
  const [updatedFirstName, setUpdatedFirstName] = useState<string>("");
  const [updatedLastName, setUpdatedLastName] = useState<string>("");
  const [updatedEmail, setUpdatedEmail] = useState<string>("");
  const [passwordUppercaseCheck, setPasswordUppercaseCheck] =
    useState<boolean>(false);
  const [specialCharCheck, setSpecialCharCheck] = useState<boolean>(false);
  const [numberCheck, setNumberCheck] = useState<boolean>(false);
  const [finalPassword, setFinalPassword] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  const [saveActive, setSaveActive] = useState<boolean>(false);
  const [passwordSatisfied, setPasswordSatisfied] = useState<boolean>(false);
  const [infoPopup, setInfoPopup] = useState<boolean>(false);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //updated account Data

  const updatedAccountData = {
    firstName:
      updatedFirstName != "" ? updatedFirstName : accountData.firstName,
    lastName: updatedLastName != "" ? updatedLastName : accountData.lastName,
    email: updatedEmail != "" ? updatedEmail : accountData.email,
    password: finalPassword != "" ? finalPassword : accountData.password,
  };

  //RECEIVE DATA

  const receiveFirstName = (res: string) => {
    // capitalize the first letter
    let result = res.charAt(0).toUpperCase() + res.slice(1);
    setUpdatedFirstName(result);
  };

  const receiveLastName = (res: string) => {
    // capitalize the first letter
    let result = res.charAt(0).toUpperCase() + res.slice(1);
    setUpdatedLastName(result);
  };

  const receiveEmail = (res: string) => {
    setUpdatedEmail(res);
  };

  //first, last and email checks

  const finalCheck = () => {
    if (
      (updatedFirstName != "" && updatedFirstName != accountData.firstName) ||
      (updatedLastName != "" && updatedLastName != accountData.lastName) ||
      (updatedEmail.includes("@") && updatedEmail != accountData.email) ||
      passwordSatisfied == !false
    ) {
      setSaveActive(!false);
    } else {
      setSaveActive(false);
    }
  };

  //receive password data

  const passwordOld = (old: string) => {
    setPasswordDataOld(old);
  };
  const passwordNew = (passwordNew: string) => {
    setPasswordDataNew(passwordNew);
  };
  const passwordConfirm = (confirm: string) => {
    setPasswordDataConfirm(confirm);
  };

  //new password requirements check

  const passwordRequirementCheck = async () => {
    const specialCharFormat = /[ !@#$%^&*? ]/;
    const numberFormat = /[ 1234567890 ]/;

    const oldPasswordCheck = await axios.get(
      `/jot-user-sensitive?oldPasswordCheck=true&userId=${token}&oldPassword=${passwordDataOld}`
    );

    //uppercase Check
    const uppercaseCheck = passwordDataNew !== passwordDataNew.toLowerCase();
    if (uppercaseCheck == !false) {
      setPasswordUppercaseCheck(!false);
    } else {
      setPasswordUppercaseCheck(false);
    }

    //special character check
    const specialCharacterCheck = specialCharFormat.test(passwordDataNew);
    if (specialCharacterCheck == !false) {
      setSpecialCharCheck(!false);
    } else {
      setSpecialCharCheck(false);
    }

    //number check

    const numberCheck = numberFormat.test(passwordDataNew);
    if (numberCheck == !false) {
      setNumberCheck(!false);
    } else {
      setNumberCheck(false);
    }

    if (
      numberCheck == !false &&
      specialCharCheck == !false &&
      uppercaseCheck == !false &&
      oldPasswordCheck.data == true &&
      passwordDataNew == passwordDataConfirm
    ) {
      setPasswordSatisfied(!false);
    } else {
      setPasswordSatisfied(false);
    }
  };

  //update settings on save

  const updateAccountSettings = async () => {
    setLoading(!false);
    const res = await axios.put(
      `/jot-user-sensitive?updateAccountSettings=true&userId=${token}&updatedAccountData=${JSON.stringify(
        updatedAccountData
      )}`
    );
    if (res.data == true) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  //account settings options

  const accountSettingsOptions: {
    id: number;
    type: string;
    settings: {
      id: number;
      title: string;
      content?: string | any;
      action: Function | null;
      optionalValue?: boolean | string;
      layout: string;
      width: string;
      input: string;
      inputType: string;
      optionalContent?: string;
      inputInitialValue?: string;
      updatedInitialValue?: string;
      inputValue?: (res: string) => void;
      passwordOld?: (old: string) => void;
      passwordNew?: (passwordNew: string) => void;
      passwordConfirm?: (confirm: string) => void;
      inputInactive?: boolean;
      updatedResCheck?: boolean;
      updatedContent?: string;
      passwordSatisfied?: boolean;
      infoState?: boolean;
      setInfoPopupState?: Function;
      infoPopupState?: boolean;
    }[];
  }[] = [
    {
      id: 2,
      type: "Account",
      settings: [
        {
          id: 2.1,
          title: "username",
          layout: "row",
          width: "150px",
          input: "field",
          inputType: "text",
          inputInitialValue: username,
          updatedInitialValue: username,
          action: null,
          inputInactive: false,
          infoState: !false,
          setInfoPopupState: setInfoPopup,
          infoPopupState: infoPopup,
        },
        {
          id: 2.2,
          title: "first name",
          layout: "row",
          width: "100px",
          input: "field",
          inputType: "text",
          inputInitialValue: accountData.firstName,
          updatedInitialValue: updatedFirstName == "" ? "" : updatedFirstName,
          inputValue: receiveFirstName,
          action: setFirstInputInactive,
          optionalValue: firstInputInactive == false ? !false : false,
          inputInactive: firstInputInactive,
          updatedContent: updatedFirstName,
        },
        {
          id: 2.3,
          title: "last name",
          layout: "row",
          width: "100px",
          input: "field",
          inputType: "text",
          inputInitialValue: accountData.lastName,
          updatedInitialValue: updatedLastName == "" ? "" : updatedLastName,
          inputValue: receiveLastName,
          action: setLastInputInactive,
          optionalValue: lastInputInactive == false ? !false : false,
          inputInactive: lastInputInactive,
          updatedContent: updatedLastName,
        },
        {
          id: 2.4,
          title: "email",
          layout: "row",
          width: "150px",
          input: "field",
          inputType: "email",
          inputInitialValue: accountData.email,
          updatedInitialValue: updatedEmail == "" ? "" : updatedEmail,
          inputValue: receiveEmail,
          action: setEmailInputInactive,
          optionalValue: emailInputInactive == false ? !false : false,
          inputInactive: emailInputInactive,
          updatedContent: updatedEmail,
        },
        {
          id: 2.5,
          title: "password",
          layout: "row",
          width: "150px",
          input: "field",
          inputType: "password",
          inputInitialValue: accountData.password,
          updatedInitialValue: finalPassword == "" ? "" : finalPassword,
          passwordOld: passwordOld,
          passwordNew: passwordNew,
          passwordConfirm: passwordConfirm,
          action: setPasswordInputInactive,
          optionalValue: passwordInputInactive == false ? !false : false,
          inputInactive: passwordInputInactive,
          passwordSatisfied: passwordSatisfied,
        },
      ],
    },
  ];

  useEffect(() => {
    passwordRequirementCheck();
  }, [passwordDataOld, passwordDataConfirm, passwordDataNew]);

  return (
    <>
      {/* {loading == !false ? <Loader /> : null} */}
      {accountSettingsOptions
        .filter((el) => el.id == selection)
        .find((sub) => sub)
        ?.settings.map((data) => (
          <div
            className="settings__tile"
            style={
              data.layout == "col"
                ? { flexDirection: "column" }
                : data.layout == "row"
                ? { flexDirection: "row", border: "none" }
                : undefined
            }
            key={data.id}
          >
            <div
              className="settings__tile--top"
              style={
                data.layout == "row"
                  ? {
                      width: "100%",
                      background: "none",
                      borderBottom: "var(--border)",
                      paddingBottom: "10px",
                    }
                  : undefined
              }
            >
              <div className="settings__title--title--wrapper">
                {" "}
                <h4 className="settings__tile--title">{data.title}</h4>
                {data.optionalContent != "" ? (
                  <p className="toggle__support--content">
                    {data.optionalContent}
                  </p>
                ) : null}
                {data.infoState == !false ? (
                  <div className="account__settings--info--container">
                    <button
                      onMouseEnter={() => data.setInfoPopupState!(!false)}
                      onMouseLeave={() => data.setInfoPopupState!(false)}
                    >
                      <i
                        className="fa-regular fa-circle-question"
                        style={
                          darkActive == !false
                            ? { color: "var(--white-DM)" }
                            : undefined
                        }
                      ></i>
                    </button>
                    {data.infoPopupState == !false ? (
                      <InformationPopup
                        data={InfoData.find((el) => el.type == "username")}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="account__settings--input--wrapper">
                {data.input == "field" &&
                accountData != undefined &&
                data.inputInactive == false ? (
                  <Input
                    initialValue={
                      data.updatedInitialValue == ""
                        ? data.inputInitialValue
                        : data.updatedInitialValue
                    }
                    inactive={data.inputInactive}
                    inputValue={data.inputValue}
                    width={data.width}
                    inputType={data.inputType}
                    updatedInitialValue={data.updatedInitialValue}
                  />
                ) : null}
                {data.input == "field" &&
                accountData != undefined &&
                data.inputInactive == !false &&
                data.title != "password" ? (
                  <Input
                    initialValue={
                      data.updatedInitialValue == ""
                        ? data.inputInitialValue
                        : data.updatedInitialValue
                    }
                    inactive={data.inputInactive}
                    inputValue={data.inputValue}
                    width={data.width}
                    inputType={data.inputType}
                    updatedInitialValue={data.updatedInitialValue}
                  />
                ) : null}

                {data.input == "field" &&
                accountData != undefined &&
                data.inputInactive == !false &&
                data.title == "password" ? (
                  <div className="update__password--container">
                    <div className="update__password--input--wrapper">
                      <h5>Enter Old Password</h5>
                      <Input
                        inactive={data.inputInactive}
                        passwordOld={data.passwordOld}
                        width={data.width}
                        inputType={data.inputType}
                      />
                    </div>
                    <div className="update__password--input--wrapper">
                      <h5>Enter New Password</h5>
                      <Input
                        inactive={data.inputInactive}
                        passwordNew={data.passwordNew}
                        width={data.width}
                        inputType={data.inputType}
                      />
                    </div>
                    <div className="update__password--input--wrapper">
                      <h5>Confirm New Password</h5>
                      <Input
                        inactive={data.inputInactive}
                        passwordConfirm={data.passwordConfirm}
                        width={data.width}
                        inputType={data.inputType}
                      />
                    </div>
                    <div className="update__password--input--wrapper">
                      <div className="update__password--check--container">
                        <PasswordCheck
                          numberCheck={numberCheck}
                          passwordUppercaseCheck={passwordUppercaseCheck}
                          specialCharCheck={specialCharCheck}
                          password={passwordDataNew}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {data.inputInactive == false ? (
                  <div className="edit__button--container">
                    <Button
                      content="fa-regular fa-pen-to-square"
                      icon={!false}
                      action={data.action!}
                      optionalValue={data.optionalValue}
                      inactive={!false}
                      title={data.title}
                    />
                  </div>
                ) : (
                  <div className="edit__button--container">
                    <button
                      className="revert__edit"
                      onClick={() => {
                        if (data.inputInactive == !false) {
                          data.action!(false);
                          finalCheck();
                        }
                      }}
                    >
                      {" "}
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    {data.inputInitialValue != data.updatedContent &&
                    data.updatedContent != "" &&
                    data.title != "password" ? (
                      <button
                        className="confirm__edit"
                        onClick={() => {
                          data.action!(false);
                          finalCheck();
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    ) : null}

                    {data.passwordSatisfied == !false ? (
                      <button
                        className="confirm__edit"
                        onClick={() => {
                          data.action!(false);
                          setFinalPassword(passwordDataNew);
                          finalCheck();
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      <div className="account__settings--save--container">
        <Button
          content={"Save"}
          inactive={saveActive}
          action={updateAccountSettings}
        />
      </div>
    </>
  );
};

export const Preferences = ({ selection, preferenceData }: PreferenceProps) => {
  //recieve toggle string data

  const updateDarkmodeToggle = async (active: boolean) => {
    await axios.put(
      `/jot-user-preferences?updateDarkmode=true&userId=${token}&currentState=${active}`
    );
    window.themeCheck(token);
  };

  const preferenceOptions: {
    id: number;
    type: string;
    settings: {
      id: number;
      title: string;
      content: string | boolean | any;
      array?: boolean;
      action?: Function;
      optionalValue?: boolean | string;
      layout: string;
      input: string;
      optionalContent?: string;
      toggleTrigger?: (res: boolean) => void;
      toggleState?: boolean;
    }[];
  }[] = [
    {
      id: 3,
      type: "Preferences",
      settings: [
        {
          id: 3.1,
          title: "dark mode",
          content: "",
          array: false,
          layout: "row",
          input: "toggle",
          toggleState: preferenceData.darkMode,
          action: updateDarkmodeToggle,
        },
      ],
    },
  ];
  return (
    <>
      {preferenceOptions
        .filter((el) => el.id == selection)
        .find((sub) => sub)
        ?.settings.map((data) => (
          <div
            className="settings__tile"
            style={
              data.layout == "col"
                ? { flexDirection: "column" }
                : data.layout == "row"
                ? { flexDirection: "row", border: "none" }
                : undefined
            }
            key={data.id}
          >
            <div
              className="settings__tile--top"
              style={
                data.layout == "row"
                  ? {
                      width: "100%",
                      background: "none",
                      borderBottom: "var(--border)",
                      paddingBottom: "10px",
                    }
                  : undefined
              }
            >
              <h4 className="settings__tile--title">{data.title}</h4>
              {data.optionalContent != "" ? (
                <p className="toggle__support--content">
                  {data.optionalContent}
                </p>
              ) : null}
              <Toggle toggleState={data.toggleState} action={data.action} />
            </div>
            <div
              className="settings__tile--bottom"
              style={data.layout == "row" ? { display: "none" } : undefined}
            >
              <p>{data.content}</p>
            </div>
          </div>
        ))}
    </>
  );
};
