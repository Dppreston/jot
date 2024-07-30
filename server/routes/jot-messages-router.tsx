let express = require("express");
let messagesRouter = express.Router();
let schemas = require("../schemas/schemas.ts");
let React = require("react");

messagesRouter.get("/jot-messages", async (req, res) => {
  const {
    convoCheck,
    receiverId,
    userId,
    globalUserMessageFetch,
    selectedConvoFetch,
    convoId,
  } = req.query;
  const messages = schemas.JotMessages;

  //first message convo check

  if (convoCheck) {
    const allMessages = await messages.find({}).exec();

    //existing convo check

    const check = allMessages.filter((data) =>
      data.users.every((el) => [receiverId, userId].indexOf(el) > -1)
    );

    if (check.length > 0) {
      // check for deleted

      const deletedCheck = check[0].deletedUsers.find((el) => el == userId);

      if (deletedCheck != undefined) {
        return res.send(JSON.stringify(deletedCheck[0]._id));
      } else {
        return res.send(JSON.stringify(check[0]._id));
      }
    } else {
      return res.send(false);
    }
  }

  //global convo check

  if (globalUserMessageFetch) {
    const allMessages = await messages.find({}).exec();

    //filter messages for user

    const userFiltered = allMessages.filter((data) =>
      data.users.some((el) => el == userId)
    );

    //delete check
    const finalFiltered = userFiltered.filter(
      (data) => !data.deletedUsers.some((el) => el == userId)
    );

    if (finalFiltered) {
      return res.send(
        JSON.stringify(
          finalFiltered.sort(
            (a, b) =>
              new Date(b.messages.slice(-1)[0].creationDate).getTime() -
              new Date(a.messages.slice(-1)[0].creationDate).getTime()
          )
        )
      );
    } else {
      return res.send(false);
    }
  }

  //selected conversation

  if (selectedConvoFetch) {
    const data = await messages.find({ _id: convoId }).exec();
    if (data) {
      return res.send(JSON.stringify(data));
    }
  }
});

messagesRouter.post("/jot-messages", async (req, res) => {
  const conversationData = req.body;
  const { initConversation } = req.query;

  //new conversation

  const newConvoData = {
    users: conversationData.users,
    deletedUsers: [],
    messages: [
      {
        _id: Math.floor(Math.random() * 1000000000000000),
        content: conversationData.messageContent,
        sender: conversationData.sender,
        receiver: conversationData.receiver,
        likedUsers: [],
        dislikedUsers: [],
        creationDate: new Date(Date.now()),
      },
    ],
    active: true,
  };

  if (initConversation) {
    const newConvo = new schemas.JotMessages(newConvoData);
    const save = newConvo.save();

    if (save) {
      return res.send(newConvo._id);
    } else {
      return res.send(false);
    }
  }
});

messagesRouter.put("/jot-messages", async (req, res) => {
  const messages = schemas.JotMessages;

  const {
    sendMessage,
    convoId,
    senderId,
    receiverId,
    messageContent,
    deleteConversation,
    userId,
    setUnread,
    sentMessageUnread,
    selectedReadUpdate,
    activeCheck,
    messageId,
    messageInteraction,
    type,
    selectedUnread,
  } = req.query;

  //send message

  if (sendMessage) {
    const action = await messages.updateOne(
      { _id: convoId },
      {
        $push: {
          "messages": {
            _id: Math.floor(Math.random() * 1000000000000000),
            content: messageContent,
            sender: senderId,
            receiver: receiverId,
            likedUsers: [],
            dislikedUsers: [],
            creationDate: new Date(Date.now()),
          },
        },
      }
    );

    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //like / dislike message

  if (messageInteraction) {
    const convo = await messages.find({ _id: convoId }).exec();

    //message likedCheck

    const likedCheck = convo[0].messages
      .find((el) => el._id == Number(messageId))
      .likedUsers.find((el) => el == userId);

    const dislikedCheck = convo[0].messages
      .find((el) => el._id == Number(messageId))
      .dislikedUsers.find((el) => el == userId);

    if (type == Number(1)) {
      if (likedCheck == undefined) {
        //add like

        const addAction = await messages
          .updateOne(
            { _id: convoId, "messages._id": Number(messageId) },
            {
              $push: { "messages.$.likedUsers": userId },
            }
          )

          .exec();

        //remove dislike if applicable

        await messages.updateOne(
          { _id: convoId, "messages._id": Number(messageId) },
          {
            $pull: { "messages.$.dislikedUsers": userId },
          }
        );

        if (addAction) {
          return res.send(JSON.stringify("messageLike"));
        }
      } else {
        const removeAction = await messages.updateOne(
          { _id: convoId, "messages._id": Number(messageId) },
          {
            $pull: { "messages.$.likedUsers": userId },
          }
        );

        if (removeAction) {
          return res.send(false);
        }
      }
    } else {
      if (dislikedCheck == undefined) {
        //add dislike

        const addAction = await messages
          .updateOne(
            { _id: convoId, "messages._id": Number(messageId) },
            {
              $push: { "messages.$.dislikedUsers": userId },
            }
          )

          .exec();

        //remove like if applicable

        await messages.updateOne(
          { _id: convoId, "messages._id": Number(messageId) },
          {
            $pull: { "messages.$.likedUsers": userId },
          }
        );

        if (addAction) {
          return res.send("messageDislike");
        }
      } else {
        const removeAction = await messages.updateOne(
          { _id: convoId, "messages._id": Number(messageId) },
          {
            $pull: { "messages.$.dislikedUsers": userId },
          }
        );

        if (removeAction) {
          return res.send(false);
        }
      }
    }
  }

  //delete conversation | add user to deleted users

  if (deleteConversation) {
    const action = await messages.updateOne(
      { _id: convoId },
      {
        $push: { "deletedUsers": userId },
      }
    );

    if (action) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  //set unread // read button

  if (setUnread) {
    const convo = await messages.find({ _id: convoId }).exec();
    const unreadCheck = convo[0].unreadUsers.find((el) => el == userId);
    if (selectedUnread == "undefined") {
      if (unreadCheck == undefined) {
        const action = await messages.updateOne(
          { _id: convoId },
          {
            $push: { "unreadUsers": userId },
          }
        );

        if (action) {
          return res.send(true);
        }
      } else {
        const removeAction = await messages.updateOne(
          { _id: convoId },
          {
            $pull: { "unreadUsers": userId },
          }
        );

        if (removeAction) {
          return res.send(false);
        }
      }
    } else {
      //set as read if conversation is selected

      const action = await messages.updateOne(
        { _id: convoId },
        {
          $pull: { "unreadUsers": userId },
        }
      );

      if (action) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    }
  }

  //set unread on message sent

  if (sentMessageUnread) {
    const convo = await messages.find({ _id: convoId }).exec();
    const unreadCheck = convo[0].unreadUsers.find((el) => el == receiverId);
    if (unreadCheck == undefined) {
      const action = await messages.updateOne(
        { _id: convoId },
        {
          $push: { "unreadUsers": receiverId },
        }
      );

      if (action) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    } else {
      return;
    }
  }

  //selected convo read update

  if (selectedReadUpdate) {
    const convo = await messages.find({ _id: convoId }).exec();
    const check = convo[0].unreadUsers.find((el) => el == userId);

    if (check != undefined) {
      const action = await messages.updateOne(
        { _id: convoId },
        {
          $pull: { "unreadUsers": userId },
        }
      );
      if (action) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    } else {
      return;
    }
  }

  //check and update convo status

  if (activeCheck) {
    const data = await messages.find({ _id: convoId }).exec();
    const check = data[0].deletedUsers?.length;

    if (check < 2) {
      return res.send(false);
    } else {
      const action = await messages.updateOne(
        { _id: convoId },
        {
          "active": false,
        }
      );
      if (action) {
        return res.send(true);
      }
    }
  }
});

module.exports = messagesRouter;
