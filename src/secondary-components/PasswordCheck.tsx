import check from "../assets/small-loader-done.mp4";

type InputCheckProps = {
  password: string;
  passwordUppercaseCheck: boolean;
  specialCharCheck: boolean;
  numberCheck: boolean;
};

const PasswordCheck = ({
  password,
  passwordUppercaseCheck,
  specialCharCheck,
  numberCheck,
}: InputCheckProps) => {
  return (
    <>
      <div className="signup__info--dropdown">
        <span>
          <h3>Must Include</h3>
        </span>
        <span>
          <h4>
            {" "}
            One Uppercase Letter{" "}
            {passwordUppercaseCheck == false ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <video
                src={check}
                id="signup__info--check"
                autoPlay
                muted
                playsInline
              ></video>
            )}
          </h4>
        </span>
        <span>
          <h4>
            {" "}
            One Number{" "}
            {numberCheck == false ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <video
                src={check}
                id="signup__info--check"
                autoPlay
                muted
                playsInline
              ></video>
            )}
          </h4>
        </span>
        <span>
          <h4>
            One Special Character{" "}
            {specialCharCheck == false ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <video
                src={check}
                id="signup__info--check"
                autoPlay
                muted
                playsInline
              ></video>
            )}
          </h4>
        </span>
        <span>
          <h4>
            At Least 6 Characters{" "}
            {password.length < 6 ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <video
                src={check}
                id="signup__info--check"
                autoPlay
                muted
                playsInline
              ></video>
            )}
          </h4>
        </span>
      </div>
    </>
  );
};
export default PasswordCheck;
