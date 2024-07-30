import { useContext } from "react";
import { GlobalContext, UserContext } from "../App";

const CreateSideTile = () => {
  const { setCreateActive } = useContext<GlobalContext>(UserContext);

  //create post button

  //back button detection

  return (
    <>
      <div className="create__side--tile--container">
        <button
          id="create__side--tile--button"
          onClick={() => setCreateActive(!false)}
        >
          <h3>Create A Post </h3>
        </button>
      </div>
    </>
  );
};

export default CreateSideTile;
