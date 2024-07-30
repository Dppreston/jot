import axios from "axios";
import Button from "../buttons/ButtonMain";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import { useContext, useEffect, useState } from "react";
import { GlobalContext, MessageData, UserContext } from "../App";
const token: string | null = localStorage.getItem(`token`);

type MessageListProps = {
  newMessageTrigger: (res: boolean) => void;
  clearSelectedConvoData: Function;
};

type TileProps = {
  messageData: {
    _id: number;
    content: string;
    sender: string;
    receiver: string;
    creationDate: Date;
  };
  conversationId: string;
  otherUserId: string | undefined;
  specificRead: string | undefined;
};

export const MessageNavTile = ({
  messageData,
  conversationId,
  otherUserId,
  specificRead,
}: TileProps) => {
  const [profilePicUrl, setProfilePicUrl] = useState<string>();
  const [imgVersion, setImgVersion] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [messageInteractionActive, setMessageInteractionActive] =
    useState<boolean>(false);
  const [
    messageInteractionDropdownActive,
    setMessageInteractionDropdownActive,
  ] = useState<boolean>(false);
  const { setConfirmActive, setConfirmConditions, darkActive } =
    useContext<GlobalContext>(UserContext);

  //fetch username and img for messages

  const userDataFetch = async () => {
    const res = await axios.get(
      `/jot-users?messageUsername=true&userId=${otherUserId}`
    );

    if (res.data) {
      setUsername(res.data[0][0].username);
      setImgVersion(res.data[0][0].profileImgVersion);
      setProfilePicUrl(res.data[0][0].profilePicture);
    }
  };

  //single user delete conversation

  const deleteConversation = async () => {
    const res = await axios.put(
      `/jot-messages?deleteConversation=true&userId=${token}&convoId=${conversationId}`
    );
    if (res.data == !false) {
      //check to change status of convo
      await axios.put(
        `/jot-messages?activeCheck=true&convoId=${conversationId}`
      );

      window.location.reload();
    }
  };

  useEffect(() => {
    userDataFetch();
  }, [messageData]);

  return (
    <>
      <div
        className="message__nav--tile"
        onMouseEnter={() => setMessageInteractionActive(!false)}
        onMouseLeave={() => {
          setMessageInteractionActive(false),
            setMessageInteractionDropdownActive(false);
        }}
      >
        <button
          className="message__tile--select--container"
          onClick={() => {
            window.selectedConvoFetch(conversationId);
          }}
        >
          <div className="message__tile--left">
            <div className="message__tile--img--container">
              <img
                id="message__tile--img"
                alt="profile-pic"
                src={`${profilePicUrl}.js?version=${imgVersion}`}
              />
            </div>
          </div>
          <div className="message__tile--right">
            <h3>{username}</h3>
            <h4 className="message__preview">
              {messageData?.content.substring(0, 22)} ...
            </h4>
          </div>
        </button>
        {messageInteractionActive == !false ? (
          <div
            className="nav__message--interaction--container"
            style={
              darkActive == !false
                ? { background: "var(--hover-DM)" }
                : undefined
            }
            onClick={() => {
              setMessageInteractionDropdownActive(!false);
            }}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        ) : null}
        {messageInteractionDropdownActive == !false ? (
          <div
            className="message__nav--interaction--dropdown "
            style={
              darkActive == !false
                ? { background: "var(--hover-on-black-DM)" }
                : undefined
            }
            onMouseLeave={() => {
              setMessageInteractionDropdownActive(false),
                setMessageInteractionActive(false);
            }}
          >
            <button
              className="message__nav--interaction--tile "
              style={
                darkActive == !false ? { color: "var(--white-DM)" } : undefined
              }
              onClick={() => {
                setMessageInteractionDropdownActive(false),
                  setMessageInteractionActive(false);
                window.messageRead(conversationId);
                setTimeout(() => {
                  window.globalUserMessageCheck();
                }, 300);
              }}
            >
              <i className="fa-solid fa-check"></i>
              {specificRead == undefined ? (
                <h4>Mark as unread</h4>
              ) : (
                <h4>Mark as Read</h4>
              )}
            </button>
            <button
              className="message__nav--interaction--tile"
              style={
                darkActive == !false ? { color: "var(--white-DM)" } : undefined
              }
              onClick={() => {
                setMessageInteractionDropdownActive(false),
                  setConfirmActive(!false);
                setConfirmConditions({
                  content: "Are you sure you want to delete this conversation?",
                  confirmAction: deleteConversation,
                });
                setMessageInteractionActive(false);
              }}
            >
              <i className="fa-solid fa-trash"></i>
              <h4>Delete conversation</h4>
            </button>
          </div>
        ) : null}
        {specificRead != undefined ? (
          <i id="read__identifier--message" className="fa-solid fa-circle"></i>
        ) : null}
      </div>
    </>
  );
};

const MessageListMain = ({
  newMessageTrigger,
  clearSelectedConvoData,
}: MessageListProps) => {
  const { messageData } = useContext<MessageData>(UserContext);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div
        className="message__list--wrapper"
        style={
          darkActive == !false
            ? { background: "var(--hover-on-black-DM)" }
            : undefined
        }
      >
        <div className="message__list--top">
          <h4>Conversations</h4>
          <Button
            content="fa-regular fa-pen-to-square"
            icon={!false}
            inactive={!false}
            action={newMessageTrigger}
            optionalValue={!false}
            secondAction={clearSelectedConvoData}
            secondOptionalValue={undefined}
          />
        </div>

        <div className="message__list--bottom">
          {messageData != undefined
            ? messageData.map((data, key) => (
                <MessageNavTile
                  messageData={data.messages[data.messages.length - 1]}
                  conversationId={data._id}
                  key={key}
                  otherUserId={data.users.find((el) => el != token)}
                  specificRead={data.unreadUsers.find((el) => el == token)}
                />
              ))
            : emptyData
                .filter((el) => el.id == 7)
                .map((data, key) => <EmptyContent data={data} key={key} />)}
        </div>
      </div>
    </>
  );
};
export default MessageListMain;
