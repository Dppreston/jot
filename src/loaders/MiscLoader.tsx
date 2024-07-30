import loader from "../assets/jot-loader-2.mp4";
const MiscLoader = () => {
  return (
    <div className="misc__loader--container search__loader">
      <video src={loader} autoPlay muted loop className="misc__loader"></video>
    </div>
  );
};
export default MiscLoader;
