import { useContext, useEffect, useState } from "react";
import Button from "../buttons/ButtonMain";
import axios from "axios";
import { GlobalContext, UserContext } from "../App";

type FFProps = {
  action: number;
  close: Function;
  userId: string | undefined;
};

type FFData = {
  _id: string;
  username: string;
  profilePicUrl: string;
  profileImgVersion: number;
};

const FollowerFollowing = ({ action, close, userId }: FFProps) => {
  const [ffData, setFFData] = useState<FFData[]>();
  const { darkActive } = useContext<GlobalContext>(UserContext);

  const fetchFF = async () => {
    const res = await axios.get(
      `/jot-users?fetchFF=true&userId=${userId}&FFOption=${action}`
    );
    setFFData(res.data);
  };

  const searchFF = async (ffSearchContent: string) => {
    const res = await axios.get(
      `/jot-users?searchFF=true&userId=${userId}&FFOption=${action}&ffSearchContent=${ffSearchContent}`
    );
    setFFData(res.data);
  };

  useEffect(() => {
    fetchFF();
  }, [action]);

  return (
    <>
      <div className="full__blur--wrapper">
        <div
          className="follower__following--wrapper"
          style={
            darkActive == !false
              ? { background: "var(--hover-on-black-DM" }
              : undefined
          }
        >
          <div className="ff__upper--container">
            <h3>{action == 1 ? "Followers" : "Following"}</h3>
            <Button
              content="fa-solid fa-xmark"
              icon={!false}
              inactive={!false}
              action={close}
              optionalValue={undefined}
            />
          </div>
          <div className="ff__middle--container">
            <input
              id="ff__search"
              placeholder={`Search ${action == 1 ? "Followers" : "Following"}`}
              onChange={(e) => {
                searchFF(e.currentTarget.value);
              }}
              style={
                darkActive == !false
                  ? {
                      background: "var(--hover-DM",
                      color: "var(--white-DM)",
                    }
                  : undefined
              }
            />
          </div>
          <div className="ff__lower--container">
            {ffData != undefined
              ? ffData.map((data) => (
                  <button
                    className="ff__tile"
                    key={data._id}
                    onClick={(e) => {
                      e.preventDefault;
                      window.location.href = `${window.location.origin}/user/${data.username}/${data._id}`;
                    }}
                    style={
                      darkActive == !false
                        ? {
                            color: "var(--white-DM)",
                          }
                        : undefined
                    }
                  >
                    <div className="ff__tile--img--container">
                      <img
                        src={`${data.profilePicUrl}.js?version=${data.profileImgVersion}`}
                        alt="profile__pic"
                        id="ff__tile--img"
                        loading="lazy"
                      />
                    </div>
                    <h4>{data.username}</h4>
                  </button>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default FollowerFollowing;
