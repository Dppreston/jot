import { useContext, useEffect } from "react";
import { GlobalContext, UserContext } from "../App";

type InfoDataProps = {
  data?: {
    id: number;
    type: string;
    info: string;
  };
};

const InformationPopup = ({ data }: InfoDataProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, []);
  return (
    <>
      <div
        className="info__bubble"
        style={
          darkActive == !false
            ? { border: "var(--border-on-hover-DM)" }
            : undefined
        }
      >
        <h4>{data!.info}</h4>
      </div>
    </>
  );
};
export default InformationPopup;
