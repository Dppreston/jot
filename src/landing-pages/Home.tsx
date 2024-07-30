import MainFeed from "../main-components/MainFeed";
import Navbar from "../main-components/Navbar";
import { useContext, useEffect, useState } from "react";
import RecUsers from "../side-components/RecUsers";
import Help from "../side-components/Help";
import { useParams } from "react-router";
import CreateSideTile from "../side-components/CreateSideTile";
import { GlobalContext, UserContext } from "../App";
import Welcome from "../side-components/Welcome";
import FollowRequest from "../side-components/FollowRequest";

const token: string | null = localStorage.getItem("token");

const Home = () => {
  const {
    loggedin,
    userSuggestions,
    followRequestAlerts,
    mobileMedia,
    darkActive,
  } = useContext<GlobalContext>(UserContext);
  const { searchCategory } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("popular");

  window.onload = () => {
    {
      loggedin == false
        ? setTimeout(() => {
            window.history.pushState(
              "",
              "",
              `/home/${""}${searchCategory ? searchCategory : ""}`
            );
          }, 300)
        : setTimeout(
            () =>
              window.history.pushState(
                "",
                "",
                `/home/${token}/${searchCategory ? searchCategory : ""}`
              ),
            300
          );
    }
  };

  //category check

  const categoryCheck = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    window.recommendedUsers(token);

    //check for search
    setTimeout(() => {
      if (searchCategory) {
        setSelectedCategory(searchCategory);
        window.loginCheck(token);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (loggedin == !false) {
      window.followRequestAlert();
    }
  }, [loggedin]);

  return (
    <>
      <Navbar
        selectedCategory={selectedCategory}
        categoryCheck={categoryCheck}
      />

      <div className="margin__wrapper">
        <div className="site__wrapper">
          {mobileMedia == !false && loggedin == false ? <Welcome /> : null}
          {mobileMedia == !false && loggedin == !false ? (
            <div className="mobile__selected--display">
              <h6>{selectedCategory}</h6>
              <span
                style={
                  darkActive == !false
                    ? { background: "var(--hover-on-black-DM)" }
                    : undefined
                }
              ></span>
            </div>
          ) : null}
          <div className="site__column--wrapper">
            <MainFeed selectedCategory={selectedCategory} />
          </div>
          {mobileMedia == false ? (
            <div className="site__column--wrapper">
              {loggedin == !false ? <CreateSideTile /> : <Welcome />}
              {followRequestAlerts != undefined
                ? followRequestAlerts?.map((data, key) => (
                    <FollowRequest userData={data} key={key} />
                  ))
                : null}

              <div className="recommended__users--container">
                <h3>Recommended Users</h3>
                {userSuggestions?.map((data, key) => (
                  <RecUsers userSuggestions={data} key={key} />
                ))}
              </div>

              <Help />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default Home;
