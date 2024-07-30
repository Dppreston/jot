import check from "../assets/small-loader-done.mp4";

type InputProps = {
  initialValue?: string;
  inactive: boolean | undefined;
  inputValue?: (res: string) => void;
  passwordOld?: (old: string) => void;
  passwordNew?: (passwordNew: string) => void;
  passwordConfirm?: (confirm: string) => void;
  width: string;
  inputType: string;
  updatedInitialValue?: string;
  inputSatisfied?: boolean;
  retrieveData?: (identifier: string, input: string) => void;
  identifier?: string;
  color?: string;
  maxLength?: number;
};

const Input = ({
  initialValue,
  inactive,
  inputValue,
  width,
  inputType,
  passwordOld,
  passwordNew,
  passwordConfirm,
  updatedInitialValue,
  inputSatisfied,
  retrieveData,
  identifier,
  color,
  maxLength,
}: InputProps) => {
  return (
    <>
      <div className="input__container">
        <input
          className="input__style"
          defaultValue={
            inactive == false
              ? initialValue
              : updatedInitialValue == ""
              ? initialValue
              : updatedInitialValue
          }
          maxLength={maxLength ? maxLength : undefined}
          style={
            inactive == false
              ? {
                  opacity: "0.6",
                  pointerEvents: "none",
                  width: width,
                  background: `${color != undefined ? color : undefined}`,
                }
              : {
                  width: width,
                  background: `${color != undefined ? color : undefined}`,
                  color: `${
                    color != undefined ? "var(--white-DM)" : undefined
                  }`,
                }
          }
          type={inputType}
          onChange={(e) => {
            if (inputValue) {
              inputValue!(e.currentTarget.value);
            }
            if (passwordOld) {
              passwordOld(e.currentTarget.value);
            }
            if (passwordNew) {
              passwordNew(e.currentTarget.value);
            }
            if (passwordConfirm) {
              passwordConfirm(e.currentTarget.value);
            }
            if (retrieveData) {
              retrieveData!(identifier!, e.currentTarget.value);
            }
          }}
        />
        {inputSatisfied == !false ? (
          <video src={check} autoPlay muted className="input__satisfied" />
        ) : null}
      </div>
    </>
  );
};
export default Input;
