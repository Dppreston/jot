import axios from "axios";
import { useContext, useState } from "react";
import { GlobalContext, NotificationData, UserContext } from "../App";
import { useParams } from "react-router";

type MessageTileProps = {
  messages: {
    _id: number;
    content: string;
    sender: string;
    receiver: string;
    likedUsers: string[];
    dislikedUsers: string[];
    creationDate: Date;
  };
  convoId: string;
  convoUsers: string[];
};
const token: string | null = localStorage.getItem("token");

const MessageTile = ({ messages, convoId, convoUsers }: MessageTileProps) => {
  const [timeActive, setTimeActive] = useState<boolean>(false);
  const [interactionActive, setInteractionActive] = useState<boolean>(false);
  const { username } = useParams();
  const { darkActive } = useContext<GlobalContext>(UserContext);

  const handleMessageInteraction = async (messageId: number, type: number) => {
    const res = await axios.put(
      `/jot-messages?messageInteraction=true&messageId=${messageId}&userId=${token}&convoId=${convoId}&type=${type}`
    );

    //message like notification

    if (res.data == "messageLike") {
      if (messages.sender != token) {
        let notificationData: NotificationData = {
          referenceUserId: convoUsers.find((el) => el != token)!,
          referenceId: convoId,
          actionUserId: token!,
          username: username,
          type: res.data,
        };

        window.handleNotification(notificationData);
      }
    }
    //message dislike notification
    if (res.data == "messageDislike") {
      if (messages.sender != token) {
        let notificationData: NotificationData = {
          referenceUserId: convoUsers.find((el) => el != token)!,
          referenceId: convoId,
          actionUserId: token!,
          username: username,
          type: res.data,
        };

        window.handleNotification(notificationData);
      }
    }
  };

  return (
    <>
      <div className="message__tile--row">
        <div
          className="main__message--tile--container"
          onClick={() => {
            setTimeActive(!false),
              setTimeout(() => {
                setInteractionActive(!false);
              }, 100);
          }}
          onMouseLeave={() => {
            setTimeActive(false);
            setInteractionActive(false);
          }}
          style={
            messages.sender == token
              ? {
                  marginLeft: "auto",
                }
              : {
                  marginRight: "auto",
                }
          }
        >
          <div
            className="main__message--tile"
            style={
              messages.sender == token
                ? {
                    marginLeft: "auto",
                    // background: "var(--hover-on-grey)",
                    border: "var(--border)",
                  }
                : {
                    marginRight: "auto",
                    border: "var(--border)",
                    background: `${
                      darkActive == !false
                        ? "var(--hover-on-black-DM"
                        : "var(--hover-on-grey)"
                    }`,
                  }
            }
          >
            {messages.likedUsers.length + messages.dislikedUsers.length > 1 ? (
              <span
                className="message__interaction--counter"
                style={
                  darkActive == !false
                    ? {
                        left: messages.sender == token ? undefined : "100%",
                        background: "var(--hover-on-black-DM)",
                      }
                    : undefined
                }
              >
                <h5>
                  {messages.likedUsers.length + messages.dislikedUsers.length}
                </h5>
              </span>
            ) : null}

            {messages.likedUsers.length > 0
              ? messages.likedUsers.map((data) => (
                  <button
                    key={data}
                    className="message__interaction--style message__liked--identifier"
                    style={{
                      background: `${
                        data == token
                          ? "var(--accent)"
                          : `${
                              darkActive == !false
                                ? "var(--hover-on-black-DM)"
                                : "var(--white-DM)"
                            }`
                      }`,
                      color: `${
                        data == token ? "var(--white-DM)" : "var(--accent)"
                      }`,
                      top: `-15px`,
                      left: `${messages.sender == token ? "-5px" : "80%"}`,
                    }}
                  >
                    <i className="fa-regular fa-thumbs-up"></i>
                  </button>
                ))
              : null}
            {messages.dislikedUsers.length > 0
              ? messages?.dislikedUsers.map((data) => (
                  <button
                    key={data}
                    className="message__interaction--style message__liked--identifier"
                    style={{
                      background: `${
                        data == token ? "var(--accent)" : "var(--white-DM)"
                      }`,
                      color: `${
                        data == token ? "var(--white-DM)" : "var(--accent)"
                      }`,
                      top: `-15px`,
                      left: `${messages.sender == token ? "-5px" : "90%"}`,
                    }}
                  >
                    <i className="fa-regular fa-thumbs-down"></i>
                  </button>
                ))
              : null}

            <h4>{messages.content}</h4>
            {interactionActive == !false ? (
              <div
                className="message__interaction--container"
                style={
                  messages.sender == token
                    ? { right: "100%" }
                    : { left: "100%" }
                }
              >
                <button
                  className="message__interaction--style"
                  onClick={() => {
                    handleMessageInteraction(messages._id, 1),
                      setTimeout(() => {
                        window.selectedConvoFetch(convoId);
                      }, 300);
                  }}
                >
                  <i className="fa-regular fa-thumbs-up"></i>
                </button>
                <button
                  className="message__interaction--style"
                  onClick={() => {
                    handleMessageInteraction(messages._id, 2),
                      setTimeout(() => {
                        window.selectedConvoFetch(convoId);
                      }, 300);
                  }}
                >
                  <i className="fa-regular fa-thumbs-down"></i>
                </button>
              </div>
            ) : null}
          </div>

          {timeActive == !false ? (
            <div
              className="message__sent--date--container"
              style={
                messages.sender == token
                  ? {
                      textAlign: "right",
                      justifyContent: "right",
                      paddingRight: "5px",
                      right: "5%",
                    }
                  : { textAlign: "left", paddingLeft: "5px", left: "5%" }
              }
            >
              <h5 className="message__sent--date">
                {new Date(messages.creationDate!).toLocaleDateString()}
              </h5>
              <h5>at</h5>
              <h5 className="message__sent--time">
                {new Date(messages.creationDate!).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </h5>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
export default MessageTile;
