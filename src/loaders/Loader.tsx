import { useContext, useEffect, useState } from "react";
import loader from "../assets/jot-loader.mp4";
import darkLoader from "../assets/jot-loader-DM.mp4";
import loadingDone from "../assets/small-loader-done.mp4";
import { GlobalContext, UserContext } from "../App";

type LoadingProps = {
  loadingState: boolean;
  redirect?: string | undefined;
};

const Loader = ({ loadingState, redirect }: LoadingProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  const animationTrigger = () => {
    let firstAnimation = document.querySelector(".loader__container");

    darkActive == false || darkActive == undefined
      ? firstAnimation!?.setAttribute(
          "style",
          `animation: loading--done forwards .3s;`
        )
      : firstAnimation!?.setAttribute(
          "style",
          `animation: loading--done forwards .3s; background: var(--hover-on-black-DM); `
        );

    firstAnimation?.addEventListener("animationend", () => {
      setTimeout(() => {
        redirect != undefined
          ? (window.location.href = redirect)
          : window.location.reload();
      }, 1000);
    });
  };

  return (
    <>
      <div className="full__blur--wrapper">
        <div
          className="loader__container"
          style={
            darkActive == !false
              ? { background: "var(--hover-on-black-DM)" }
              : undefined
          }
        >
          {loadingState == false ? (
            <video
              src={darkActive == !false ? darkLoader : loader}
              autoPlay
              muted
              loop
              className="loader"
            ></video>
          ) : (
            <div className="loading__done--container">
              <video
                src={loadingDone}
                autoPlay
                muted
                className="loader__main--done loader"
                onEnded={() => animationTrigger()}
              ></video>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Loader;
