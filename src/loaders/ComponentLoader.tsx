import smallLoader from "../assets/small--loader.gif";
import smallLoaderDark from "../assets/small--loader--dark.gif";
import { useContext, useEffect } from "react";
import { GlobalContext, UserContext } from "../App";

const ComponentLoader = () => {
  const { darkActive, loggedin } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div className="component__loader--wrapper">
        <img
          src={
            darkActive == false || loggedin == false
              ? smallLoader
              : smallLoaderDark
          }
          alt="small__loader"
          id="component__loader"
        />
      </div>
    </>
  );
};
export default ComponentLoader;
