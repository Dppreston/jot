import { useContext, useEffect, useState } from "react";
import { GlobalContext, UserContext } from "../App";
import darkLogo from "../assets/jot-logo-DM.png";
import { useParams } from "react-router";
import errorData from "../staticdata/ErrData";
import Navbar from "../main-components/Navbar";

type ErrorData =
  | {
      _id: number;
      title: string;
      img?: string;
      type: number;
    }
  | undefined;

const Error = () => {
  const { errorType } = useParams();
  const { darkActive } = useContext<GlobalContext>(UserContext);
  const [currentError, setCurrentError] = useState<ErrorData>();

  const handleSelectedError = () => {
    const selectedErrorData = errorData.find(
      (el) => el.type == Number(errorType)
    );

    if (selectedErrorData) {
      setCurrentError(selectedErrorData);
    }
  };

  useEffect(() => {
    if (errorType == undefined) {
      setCurrentError(errorData.find((el) => el.type == 404));
    } else {
      handleSelectedError();
    }
  }, []);

  return (
    <>
      <Navbar />
      {currentError != undefined ? (
        <div
          className="error__wrapper"
          style={
            darkActive == !false ? { background: "var(--black-DM)" } : undefined
          }
        >
          <div className="error__container">
            <img
              src={darkActive == !false ? darkLogo : currentError?.img}
              alt="error--img"
            />

            <div className="error__type--container">
              <h1>{currentError?.type}</h1>
              <i
                className="fa-solid fa-question"
                style={
                  darkActive == !false
                    ? { color: "var(--white-DM)" }
                    : undefined
                }
              ></i>
            </div>
            <h3>{currentError?.title}</h3>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default Error;
