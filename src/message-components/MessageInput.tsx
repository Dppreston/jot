import { useContext, useState } from "react";
import { GlobalContext, UserContext } from "../App";

type MessageInputProps = {
  action?: Function;
  receieveMessageData: (data: string) => void;
  messageData: string | undefined;
};

const MessageInput = ({
  action,
  receieveMessageData,
  messageData,
}: MessageInputProps) => {
  const [messageValuetoClear, setMessageValueToClear] = useState<string>("");
  const { darkActive } = useContext<GlobalContext>(UserContext);
  return (
    <>
      <div className="message__input--container">
        <input
          type="text"
          id="message__input"
          placeholder="Message"
          value={messageValuetoClear}
          autoComplete="off"
          onChange={(e) => {
            receieveMessageData(e.currentTarget.value);
            setMessageValueToClear(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter" && messageData != undefined) {
              action!();
              setMessageValueToClear("");
            }
          }}
          style={
            darkActive == !false ? { color: "var(--white-DM)" } : undefined
          }
        />
        <div className="message__input--button--container">
          <button
            style={
              darkActive == !false ? { color: "var(--white-DM)" } : undefined
            }
          >
            {" "}
            <i className="fa-solid fa-plus"></i>
          </button>
          <button
            onClick={(e) => {
              if (messageData != undefined) {
                action!();
                setMessageValueToClear("");
              }
            }}
          >
            <i
              className="fa-regular fa-paper-plane"
              style={
                darkActive == !false ? { color: "var(--white-DM)" } : undefined
              }
            ></i>
          </button>
        </div>
      </div>
    </>
  );
};
export default MessageInput;
