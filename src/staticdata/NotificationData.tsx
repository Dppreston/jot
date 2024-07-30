const notificationTemplate: { id: number; type: string; icon: string }[] = [
  {
    id: 1,
    type: "postLike",
    icon: "fa-regular fa-thumbs-up",
  },
  {
    id: 2,
    type: "commentLike",
    icon: "fa-regular fa-thumbs-up",
  },
  {
    id: 3,
    type: "postDislike",
    icon: "fa-regular fa-thumbs-down",
  },
  {
    id: 4,
    type: "commentDislike",
    icon: "fa-regular fa-thumbs-down",
  },
  {
    id: 5,
    type: "newComment",
    icon: "fa-regular fa-comment",
  },
  {
    id: 6,
    type: "newReply",
    icon: "fa-solid fa-reply",
  },
  {
    id: 7,
    type: "newMessage",
    icon: "fa-regular fa-message",
  },
  {
    id: 8,
    type: "messageLike",
    icon: "fa-regular fa-thumbs-up",
  },
  {
    id: 9,
    type: "messageDislike",
    icon: "fa-regular fa-thumbs-down",
  },
];

export default notificationTemplate;
