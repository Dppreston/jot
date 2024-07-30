import { useContext } from "react";
import loader from "../assets/small--loader.gif";
import loaderDark from "../assets/small--loader--dark.gif";
import { GlobalContext, UserContext } from "../App";

type ScrollProps = {
  scrollRef: React.MutableRefObject<any>;
  inView: boolean;
  maxPost?: boolean;
};

const TileLoader = ({ scrollRef, inView }: ScrollProps) => {
  const { darkActive, loggedin } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div className="tile__loader--container" ref={scrollRef}>
        {inView == !false ? (
          <img
            src={
              darkActive == !false
                ? loaderDark
                : loader || loggedin == false
                ? loader
                : undefined
            }
            className="tile__loader"
          ></img>
        ) : null}
      </div>
    </>
  );
};
export default TileLoader;
