import { useContext, useEffect, useState } from "react";
import logo from "../assets/jot-logo.png";
import Button from "../buttons/ButtonMain";
import Input from "../buttons/Input";
import axios from "axios";
import { GlobalContext, UserContext } from "../App";
import ComponentLoader from "../loaders/ComponentLoader";

const PasswordRecovery = () => {
  const [email, setEmail] = useState<string>();
  const [satisfied, setSatisfied] = useState<boolean>();
  const [codeActive, setCodeActive] = useState<boolean>(false);
  const [tempCode, setTempCode] = useState<number>();
  const [codeInput, setCodeInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<boolean>(false);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const { setPasswordRecovery } = useContext<GlobalContext>(UserContext);

  const emailCheck = async () => {
    try {
      const res = await axios.get(
        `http://localhost:1000/jot-user-sensitive?emailCheck=true&emailCheckData=${email}`
      );

      if (res.data == false) {
        setSatisfied(!false);
      } else {
        setSatisfied(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRecovery = async () => {
    setLoading(!false);
    const emailTrigger = await axios.post(
      `http://localhost:1000/jot-user-sensitive?emailTrigger=true`,
      { email: email }
    );
    if (emailTrigger.data) {
      setTimeout(() => {
        setLoading(false);
        setTempCode(emailTrigger.data);
        setCodeActive(!false);
      }, 2000);
    }
  };

  const codeCheck = async () => {
    setLoading(!false);
    setTimeout(async () => {
      //check if code matches
      if (tempCode == Number(codeInput)) {
        const res = await axios.post(
          `http://localhost:1000/jot-user-sensitive?sendPassword=true`,
          { email: email }
        );
        if (res.data == !false) {
          setLoading(false);
          setSuccess(!false);
          setCodeActive(false);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        }
      } else {
        setLoading(false);
        setCodeError(!false);
        setIncorrectCount(incorrectCount + 1);
        setTimeout(() => {
          setCodeError(false);
        }, 2000);
      }
    }, 2000);
  };

  useEffect(() => {
    if (incorrectCount == 3) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [incorrectCount]);

  return (
    <>
      <div className="full__blur--wrapper">
        <div className="password__recovery--wrapper">
          <div className="password__recovery--top">
            <h3>Forgot Your Password? </h3>
            <Button
              inactive={!false}
              content="fa-solid fa-xmark"
              icon={!false}
              action={setPasswordRecovery}
              optionalValue={false}
            />
          </div>
          {loading == !false ? <ComponentLoader /> : null}
          {codeActive == false && loading == false && success == false ? (
            <div className="recovery__container">
              <div className="password__recovery--info--wrapper">
                <h5>
                  To recover your password, enter your email and we will send
                  you a temporary code. <br /> <br />
                  Please leave this window open, retrieve the code and enter it
                  here.
                </h5>
              </div>
              <div className="password__recovery--bottom">
                <div
                  className="recovery__input--wrapper"
                  onKeyUp={() => {
                    emailCheck();
                  }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter" && satisfied) {
                      handleRecovery();
                    }
                  }}
                >
                  <div className="recovery__input--top">
                    <h4>Enter Your Email</h4>
                    {satisfied == false && email?.length! > 0 ? (
                      <h5 style={{ color: "var(--input-error)" }}>
                        {" "}
                        No Email Found
                      </h5>
                    ) : null}
                  </div>
                  <Input
                    inputType="email"
                    inactive={!false}
                    width="100%"
                    inputValue={setEmail}
                    inputSatisfied={satisfied}
                  />
                </div>
                <Button
                  inactive={satisfied}
                  content="Sumbit"
                  action={handleRecovery}
                />
              </div>
            </div>
          ) : null}
          {codeActive == !false && loading == false ? (
            <div
              className="recovery__container code__container"
              onKeyDown={(e) => {
                if (e.key == "Enter" && satisfied) {
                  codeCheck();
                }
              }}
            >
              <h4>Enter your 5 digit code</h4>
              {codeError == !false ? (
                <h4 style={{ color: "var(--input-error)" }}>
                  {" "}
                  {incorrectCount != 3 ? "Incorrect Code" : "Too Many Attempts"}
                </h4>
              ) : null}

              <Input
                inactive={!false}
                width={"100%"}
                inputType="text"
                inputValue={setCodeInput}
                maxLength={5}
              />
              <h5>
                Didn't get a code?{" "}
                <a
                  onClick={() => {
                    handleRecovery();
                  }}
                >
                  Resend <i className="fa-solid fa-arrow-rotate-right"></i>
                </a>
              </h5>

              <Button
                content="Submit"
                inactive={
                  codeInput != undefined && codeInput!.length == 0
                    ? false
                    : !false
                }
                action={codeCheck}
              />
            </div>
          ) : null}
          {codeActive == false && loading == false && success == !false ? (
            <h4 style={{ textAlign: "center" }}>
              An email was sent to you with your password.
            </h4>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default PasswordRecovery;
