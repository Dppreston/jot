import { useContext } from "react";
import logo from "../assets/jot-logo.png";
import { GlobalContext, UserContext } from "../App";
import Button from "../buttons/ButtonMain";
const Welcome = () => {
  const { setLoginActive, mobileMedia } =
    useContext<GlobalContext>(UserContext);
  return (
    <>
      <div className="welcome__container">
        <div
          className="welcome__upper"
          style={{ padding: mobileMedia == !false ? "0" : undefined }}
        >
          <h2>
            Welcome To{" "}
            <span
              style={{
                fontFamily: `"Lobster", sans-serif`,
                fontSize: "2rem",
                color: "var(--accent)",
              }}
            >
              Jot
            </span>
          </h2>
        </div>
        {mobileMedia == false ? (
          <div className="welcome__lower">
            <img src={logo} style={{ width: "50px", height: "50px" }} />
            <span>
              <h5>
                We specialize in short, informative articles. Join our community
                for concise, enlightening reads that pack a punch.
                <br />
                <br />
                Feel free to browse as a guest, or create an account below to
                get the full experience!
              </h5>
            </span>

            <Button
              content="Get Started"
              inactive={!false}
              action={setLoginActive}
              optionalValue={!false}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
export default Welcome;
