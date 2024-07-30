import logo from "../assets/jot-logo.png";
export const helpOptions: { id: number; option: string; path: string }[] = [
  {
    id: 1,
    option: "Contact Us",
    path: "contact-us",
  },
  {
    id: 2,
    option: " FAQ ",
    path: "FAQ",
  },
  {
    id: 3,
    option: " Terms of Service",
    path: "terms-of-service",
  },
];

const Help = () => {
  return (
    <>
      <div className="help__container">
        <div className="help__top">
          {helpOptions.map((data) => (
            <button
              key={data.id}
              onClick={() => {
                window.location.href = `${window.location.origin}/info/${data.path}`;
              }}
            >
              <p className="help__option">{data.option}</p>
            </button>
          ))}
        </div>
        <div className="help__bottom">
          <i className="fa-regular fa-copyright"></i>{" "}
          <p>2024 Jot. All Rights Reserved.</p>
        </div>
      </div>
    </>
  );
};
export default Help;
