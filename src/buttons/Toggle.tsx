import { useContext, useState } from "react";
import { GlobalContext, UserContext } from "../App";

type ToggleProps = {
  toggleState?: boolean;
  action?: Function;
};

const Toggle = ({ toggleState, action }: ToggleProps) => {
  const [active, setActive] = useState<boolean>(toggleState!);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div
        className="toggle__container"
        style={
          darkActive == !false ? { background: "var(--hover-DM)" } : undefined
        }
      >
        <section
          className="toggle__thumb"
          style={
            active == !false
              ? { right: "0", background: "var(--accent)" }
              : undefined
          }
          onClick={() => {
            if (active == !false) {
              setActive(false);
              action!(false);
            } else {
              setActive(!false);
              action!(!false);
            }
          }}
        ></section>
      </div>
    </>
  );
};
export default Toggle;
