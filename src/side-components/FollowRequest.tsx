import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";

type FollowRequestProps = {
  userData: {
    _id: string | undefined;
    username: string | undefined;
  };
};

const token: string | null = localStorage.getItem(`token`);

const FollowRequest = ({ userData }: FollowRequestProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  //style for request tile

  //confirm follow

  const confirmFollow = async () => {
    const res = await axios.put(
      `http://localhost:1000/jot-users?confirmFollowRequest=true&userId=${token}&requestUserId=${userData._id}`
    );
    if (res.data == true) {
      window.followRequestAlert();
    }
  };

  const rejectFollow = async () => {
    const res = await axios.put(
      `http://localhost:1000/jot-users?rejectFollowRequest=true&userId=${token}&requestUserId=${userData._id}`
    );
    if (res.data == true) {
      window.followRequestAlert();
    }
  };

  return (
    <>
      <div
        className="follow__request--tile"
        style={
          darkActive == !false
            ? { background: "var(--hover-on-black-DM)" }
            : undefined
        }
      >
        <h5>{userData.username} wants to follow you</h5>
        <div className="request__tile--bottom">
          <Button content="Accept" inactive={!false} action={confirmFollow} />
          <Button
            content="Reject"
            inactive={!false}
            background={
              darkActive == false
                ? "var(--hover-on-white)"
                : "var(--hover-on-black-DM)"
            }
            color="black"
            action={rejectFollow}
          />
        </div>
      </div>
    </>
  );
};
export default FollowRequest;
