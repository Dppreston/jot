import logo from "../assets/jot-logo.png";

const errorData: {
  _id: number;
  type: number;
  img?: string;
  title: string;
}[] = [
  {
    _id: 1,
    type: 404,
    title: "The requested resource is unavailable",
    img: logo,
  },
];

export default errorData;
