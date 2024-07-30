import { useContext, useEffect, useState } from "react";
import Navbar from "../main-components/Navbar";
import MessageEnvironmentMain from "../message-components/MessageEnvironmentMain";
import MessageListMain from "../message-components/MessageListMain";
import { GlobalContext, MessageData, UserContext } from "../App";
import axios from "axios";
import { useParams } from "react-router";
import Button from "../buttons/ButtonMain";

const token: string | null = localStorage.getItem(`token`);

type SelectedConversationUserData = {
  otherUserId: string;
  mainUsername: string;
  starterUsername: string;
  profileImgVersion: number;
  profilePicUrl: string;
};

type ConvoData = {
  _id: string;
  users: string[];
  deletedUsers: string[];
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
  unreadUsers: string[];
};

const Messages = () => {
  const [newTrigger, setNewTrigger] = useState<boolean>(false);
  const [selectedConversationUserData, setSelectedConversationUserData] =
    useState<SelectedConversationUserData>();
  const [selectedConvoData, setSelectedConvoData] = useState<ConvoData[]>();
  const { convoId } = useParams();
  const { mobileMedia } = useContext<GlobalContext>(UserContext);

  window.onload = () => {
    if (convoId != undefined) {
      window.selectedConvoFetch(convoId);
    }
  };

  // new message trigger

  const newMessageTrigger = (res: boolean) => {
    setNewTrigger(res);
  };

  //selected convo fetch

  window.selectedConvoFetch = async (_id: string) => {
    const res = await axios.get(
      `http://localhost:1000/jot-messages?selectedConvoFetch=true&convoId=${_id}`
    );
    setSelectedConvoData(res.data);
  };

  //selected convo user data fetch

  const selectedConversationUserDataFetch = async () => {
    if (selectedConvoData) {
      let otherUserId = selectedConvoData[0].users.find((el) => el != token);
      let convoStarterId = selectedConvoData[0].messages[0].sender;

      if (otherUserId && convoStarterId) {
        const selectedConvoUsername = await axios.get(
          `http://localhost:1000/jot-users?messageUsername=true&userId=${otherUserId}&convoStarterId=${convoStarterId}`
        );

        if (selectedConvoUsername.data) {
          setSelectedConversationUserData({
            otherUserId: otherUserId,
            mainUsername: selectedConvoUsername.data[0][0].username,
            starterUsername: selectedConvoUsername.data[1][0].username,
            profileImgVersion:
              selectedConvoUsername.data[0][0].profileImgVersion,
            profilePicUrl: selectedConvoUsername.data[0][0].profilePicture,
          });
        }
      }
    }
  };

  //fetch user data for convo on selected convo

  useEffect(() => {
    if (selectedConvoData == undefined) {
      setSelectedConvoData(undefined);
    } else {
      selectedConversationUserDataFetch();
    }
  }, [selectedConvoData]);

  // //selected convo read update

  // const selectedConvoReadUpdate = async () => {
  //   const res = await axios.put(
  //     `http://localhost:1000/jot-messages?selectedReadUpdate=true&convoId=${selectedConversationId}&userId=${token}`
  //   );

  //   if (res.data == !false) {
  //     window.globalMessageCheck();
  //   }
  // };

  useEffect(() => {
    window.globalUserMessageCheck();
  }, []);

  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper site__wrapper--messages">
          {mobileMedia == false ? (
            <div className="site__column--wrapper">
              <MessageEnvironmentMain
                newMessageTrigger={newTrigger}
                cancelNewMessage={setNewTrigger}
                selectedConvoData={selectedConvoData}
                selectedConversationUserData={selectedConversationUserData}
              />
            </div>
          ) : (
            <MessageListMain
              newMessageTrigger={newMessageTrigger}
              clearSelectedConvoData={setSelectedConvoData}
            />
          )}
          {mobileMedia == false ? (
            <div className="site__column--wrapper">
              <MessageListMain
                newMessageTrigger={newMessageTrigger}
                clearSelectedConvoData={setSelectedConvoData}
              />
            </div>
          ) : (
            <MessageEnvironmentMain
              newMessageTrigger={newTrigger}
              cancelNewMessage={setNewTrigger}
              selectedConvoData={selectedConvoData}
              selectedConversationUserData={selectedConversationUserData}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default Messages;
