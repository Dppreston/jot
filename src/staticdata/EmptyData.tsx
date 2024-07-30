import emptyMessages from "../assets/jot-empty-messages.png";

const emptyData: {
  id: number;
  message?: string;
  title?: string;
  img?: string;
  icon?: boolean;
  row?: boolean;
}[] = [
  {
    id: 0,
    title: "Theres no posts in this category",
    message: "Be the first to make one...",
    icon: false,
  },

  {
    id: 5,
    title: "Theres no posts in this category",
    message: "Be the first to make one",
    img: "",
    icon: false,
  },
  {
    id: 6,
    title: "This user has no posts",
    img: "",
  },
  {
    id: 7,
    message: "Don't be shy",
    title: "No conversations",
    img: emptyMessages,
    icon: false,
  },
  {
    id: 8,
    title: "Select a conversation",
    img: emptyMessages,
    message: "Your selected conversation will go here",
    icon: false,
  },
  {
    id: 9,
    title: "No notifications",
    img: "fa-regular fa-bell",
    icon: true,
  },
];

export default emptyData;
