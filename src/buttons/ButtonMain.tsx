type ButtonProps = {
  content: string;
  action?: Function;
  conditions?: string;
  optionalValue?: number | string | boolean;
  icon?: boolean;
  inactive?: boolean;
  iconStringContent?: string;
  title?: string;
  secondAction?: Function;
  secondOptionalValue?: boolean | any;
  background?: string;
  color?: string;
};

const Button = ({
  content,
  action,
  icon,
  optionalValue,
  inactive,
  iconStringContent,
  title,
  secondAction,
  secondOptionalValue,
  color,
  background,
}: ButtonProps) => {
  return (
    //ACTIVE
    <>
      {inactive == !false && title != "username" ? (
        <button
          className={icon == true ? `button__main ${content}` : `button__main`}
          onClick={(e) => {
            e.preventDefault();

            if (secondOptionalValue == "Event") {
              action ? action!() : null;
              secondAction ? secondAction!(e) : null;
            } else {
              {
                action ? action!() : null;
                secondAction ? secondAction!() : null;
                action && optionalValue ? action!(optionalValue) : null;
                secondAction && secondOptionalValue
                  ? secondAction!(secondOptionalValue)
                  : null;
              }
            }
          }}
          style={
            icon == true
              ? {
                  fontSize: "13px",
                  padding: "3px 7px 3px 7px",
                  justifyContent: "center",
                }
              : undefined || color || background
              ? {
                  color: color,
                  background: background,
                  border: "none",
                }
              : undefined
          }
        >
          <h4>{!icon ? content : iconStringContent}</h4>
        </button>
      ) : (
        //INACTIVE
        <button
          className={icon == true ? `button__main ${content}` : `button__main`}
          onClick={(e) => {
            e.preventDefault();

            {
              optionalValue ? action!(optionalValue) : action!();
            }
          }}
          style={
            icon == true
              ? {
                  fontSize: "13px",
                  padding: "3px 7px 3px 7px",
                  pointerEvents: "none",
                  opacity: "0.8",
                }
              : { pointerEvents: "none", opacity: "0.8" }
          }
        >
          <h4>{!icon ? content : null}</h4>
        </button>
      )}
    </>
  );
};
export default Button;
