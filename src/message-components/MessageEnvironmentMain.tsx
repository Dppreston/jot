import { useContext, useEffect, useState } from "react";
import Button from "../buttons/ButtonMain";
import EmptyContent from "../secondary-components/EmptyContent";
import emptyData from "../staticdata/EmptyData";
import axios from "axios";
import MessageInput from "./MessageInput";
import MessageTile from "./MessageTile";
import { GlobalContext, NotificationData, UserContext } from "../App";
import { useParams } from "react-router";

const token: string | null = localStorage.getItem("token");

type EnvProps = {
  newMessageTrigger: boolean;
  cancelNewMessage: Function;
  selectedConvoData:
    | {
        _id: string;
        users: string[];
        deletedUsers: string[];
        unreadUsers: string[];
        messages: {
          _id: number;
          content: string;
          sender: string;
          receiver: string;
          likedUsers: string[];
          dislikedUsers: string[];
          creationDate: Date;
        }[];
        creationDate: Date;
      }[]
    | undefined;
  selectedConversationUserData:
    | {
        otherUserId: string;
        mainUsername: string;
        starterUsername: string;
        profileImgVersion: number;
        profilePicUrl: string;
      }
    | undefined;
};

type MessageUserSearchData = {
  _id: string;
  username: string;
  profilePicUrl: string;
  profileImgVersion: number;
};

type MessageUserSearchProps = {
  messageSearchUserData:
    | {
        _id: string;
        username: string;
        profilePicUrl: string;
        profileImgVersion: number;
      }[]
    | undefined;
  selectedUser: (userId: MessageUserSearchData) => void;
};

//message user search

export const MessageUserDropdown = ({
  messageSearchUserData,
  selectedUser,
}: MessageUserSearchProps) => {
  const { darkActive } = useContext<GlobalContext>(UserContext);
  return (
    <>
      <div
        className="message__user--dropdown"
        style={
          darkActive == !false
            ? {
                background: "var(--hover-on-black-DM)",
              }
            : undefined
        }
      >
        {messageSearchUserData!?.length > 0 ? (
          messageSearchUserData?.map((data) => (
            <button
              className="message__user--tile"
              key={data._id}
              onClick={() => {
                selectedUser(data);
              }}
            >
              <div className="search__user--img--container">
                <img
                  src={`${data.profilePicUrl}.js?version=${data.profileImgVersion}`}
                  alt="profile-pic"
                  id="search__user--img"
                />
              </div>
              <h4
                style={
                  darkActive == !false
                    ? {
                        color: "var(--white-DM)",
                      }
                    : undefined
                }
              >
                {data.username}
              </h4>
            </button>
          ))
        ) : (
          <h4>No user found.</h4>
        )}
      </div>
    </>
  );
};

const MessageEnvironmentMain = ({
  newMessageTrigger,
  cancelNewMessage,
  selectedConvoData,
  selectedConversationUserData,
}: EnvProps) => {
  const { username } = useParams();
  const [messageUserDropdownActive, setMessageUserDropdownActive] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [userSearchData, setUserSearchData] =
    useState<MessageUserSearchData[]>();
  const [selectedUser, setSelectedUser] = useState<MessageUserSearchData>();
  const [convoCheckRes, setConvoCheckRes] = useState<string | boolean>();
  const [messageContent, setMessageContent] = useState<string>();
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //new message user search

  const newMessageUserSearch = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-users?newMessageUserSearch=true&searchQuery=${searchQuery}&userId=${token}`
    );
    setUserSearchData(res.data);
  };

  //selected user

  const selectedUserCall = (userData: MessageUserSearchData) => {
    if (userData) {
      setMessageUserDropdownActive(false);
      setSelectedUser(userData);
      cancelNewMessage(false);
    }
  };

  //check for convo

  const newConvoCheck = async () => {
    const res = await axios.get(
      `http://localhost:1000/jot-messages?convoCheck=true&receiverId=${selectedUser?._id}&userId=${token}`
    );
    setConvoCheckRes(res.data);

    if (res.data != false) {
      window.selectedConvoFetch(res.data);
    }
  };

  //initialize conversation on first message

  const initializeConversation = async () => {
    const conversationData = {
      users: [token, selectedUser?._id],
      messageContent: messageContent,
      sender: token,
      receiver: selectedUser?._id,
    };
    const res = await axios.post(
      `http://localhost:1000/jot-messages?initConversation=true`,
      conversationData
    );

    if (res.data) {
      // add message notification

      let notificationData: NotificationData = {
        referenceUserId: selectedUser?._id!,
        username: username!,
        referenceId: res.data,
        actionUserId: token!,
        type: "newMessage",
      };
      window.handleNotification(notificationData);
      setTimeout(() => {
        window.selectedConvoFetch(res.data);
        setConvoCheckRes(undefined);
        setSelectedUser(undefined);
      }, 500);

      setTimeout(() => {
        window.globalUserMessageCheck();
      }, 1000);
    }
  };

  // receive message

  const messageData = (data: string) => {
    setMessageContent(data);
  };

  // send message

  const sendMessage = async () => {
    const res = await axios.put(
      `http://localhost:1000/jot-messages?sendMessage=true&convoId=${
        selectedConvoData![0]._id
      }&messageContent=${messageContent}&senderId=${token}&receiverId=${selectedConvoData![0].users?.find(
        (el) => el != token
      )}`
    );

    if (res.data == true) {
      setTimeout(() => {
        window.selectedConvoFetch(selectedConvoData![0]._id);
        window.globalUserMessageCheck();
      }, 300);

      //add message notification

      let notificationData: NotificationData = {
        referenceUserId: selectedConvoData![0].users?.find(
          (el) => el != token
        )!,
        username: username!,
        referenceId: selectedConvoData![0]._id,
        actionUserId: token!,
        type: "newMessage",
      };

      window.handleNotification(notificationData);

      //add new message to reciving unread

      await axios.put(
        `http://localhost:1000/jot-messages?sentMessageUnread=true&convoId=${
          selectedConvoData![0]._id
        }&receiverId=${selectedConvoData![0].users?.find((el) => el != token)}`
      );
    }
  };

  //existing convo check

  useEffect(() => {
    if (selectedUser != undefined) {
      newConvoCheck();
    }
  }, [selectedUser]);

  //new message user search

  useEffect(() => {
    searchQuery != undefined && searchQuery.length > 0
      ? newMessageUserSearch()
      : null;
  }, [searchQuery]);

  useEffect(() => {
    if (selectedConvoData != undefined) {
      window.messageRead(selectedConvoData[0]._id, true);
      setTimeout(() => {
        window.globalUserMessageCheck();
      }, 500);
    }
  }, [selectedConvoData]);

  //scroll to bottom of messages

  useEffect(() => {
    const bottom = document.querySelectorAll(".message__tile--row")[
      document.querySelectorAll(".message__tile--row").length - 1
    ];
    bottom?.scrollIntoView({ behavior: "auto" });
  }, [selectedConvoData, []]);

  return (
    <>
      <div
        className="message__env--wrapper"
        style={
          darkActive == !false
            ? {
                background: "var(--hover-on-black-DM)",
              }
            : undefined
        }
      >
        {(newMessageTrigger == false || newMessageTrigger == undefined) &&
        selectedConvoData == undefined &&
        selectedUser == undefined
          ? emptyData
              .filter((el) => el.id == 8)
              .map((data, key) => <EmptyContent data={data} key={key} />)
          : null}
        <div className="message__env--top">
          {newMessageTrigger == !false ? (
            <div className="create__message--user--input--container">
              <h4> To: </h4>
              <input
                type="text"
                id="create__message--user"
                autoFocus
                placeholder="Recipient"
                onChange={(e) => {
                  if (e.currentTarget.value.length > 0) {
                    setMessageUserDropdownActive(!false);
                  } else {
                    setMessageUserDropdownActive(false);
                  }
                  setSearchQuery(e.currentTarget.value);
                }}
                style={
                  darkActive == !false
                    ? { color: "var(--white-DM)" }
                    : undefined
                }
              />
              <Button
                content="fa-solid fa-xmark"
                icon={!false}
                inactive={!false}
                action={cancelNewMessage!}
                optionalValue={false}
              />
              {messageUserDropdownActive == !false ? (
                <MessageUserDropdown
                  messageSearchUserData={userSearchData}
                  selectedUser={selectedUserCall}
                />
              ) : null}
            </div>
          ) : selectedUser != undefined && convoCheckRes == false ? (
            <div className="message__env--top">
              <div className="message__env--top--img--container">
                <img
                  id="message__env--top--img"
                  src={`${selectedUser?.profilePicUrl}.js?version=${selectedUser?.profileImgVersion}`}
                />
              </div>
              <h3>{selectedUser?.username}</h3>
              <Button
                content="fa-solid fa-xmark"
                icon={!false}
                inactive={!false}
                action={setSelectedUser}
                optionalValue={undefined}
              />
            </div>
          ) : selectedConvoData != undefined &&
            selectedConversationUserData != undefined &&
            convoCheckRes != false ? (
            <div className="message__env--top">
              <div
                className="message__env--top--img--container"
                onClick={() =>
                  (window.location.href = `${window.location.origin}/user/${selectedConversationUserData?.mainUsername}/${selectedConversationUserData?.otherUserId}`)
                }
              >
                <img
                  id="message__env--top--img"
                  src={`${selectedConversationUserData?.profilePicUrl}.js?version=${selectedConversationUserData?.profileImgVersion}`}
                />
              </div>
              <h3>{selectedConversationUserData?.mainUsername}</h3>
            </div>
          ) : null}
        </div>
        {selectedUser != undefined && convoCheckRes == false ? (
          <div
            className="message__env--bottom"
            style={
              darkActive == !false
                ? {
                    background: "var(--hover-DM)",
                  }
                : undefined
            }
          ></div>
        ) : selectedConvoData != undefined &&
          selectedConversationUserData != undefined &&
          convoCheckRes != false ? (
          <div
            className="message__env--bottom"
            style={
              darkActive == !false
                ? {
                    background: "var(--hover-DM)",
                  }
                : undefined
            }
          >
            <div className="convo__top--container">
              <h5>
                {new Date(selectedConvoData![0].creationDate).toDateString()}
              </h5>
              <h5 className="convo__starter">
                {selectedConversationUserData.starterUsername} started the
                conversation
              </h5>
            </div>

            {selectedConvoData.length > 0
              ? selectedConvoData[0].messages?.map((data, key) => (
                  <MessageTile
                    messages={data}
                    key={key}
                    convoId={selectedConvoData[0]._id}
                    convoUsers={selectedConvoData[0].users}
                  />
                ))
              : null}
          </div>
        ) : null}
        {selectedUser != undefined && convoCheckRes == false ? (
          <MessageInput
            action={initializeConversation}
            receieveMessageData={messageData}
            messageData={messageContent}
          />
        ) : selectedConvoData != undefined && convoCheckRes != false ? (
          <MessageInput
            action={sendMessage}
            receieveMessageData={messageData}
            messageData={messageContent}
          />
        ) : null}
      </div>
    </>
  );
};
export default MessageEnvironmentMain;
