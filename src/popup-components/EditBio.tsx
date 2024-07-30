import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Button from "../buttons/ButtonMain";
import InputCounter from "../secondary-components/InputCounter";
import { GlobalContext, UserContext } from "../App";
import ComponentLoader from "../loaders/ComponentLoader";

const token: string | null = localStorage.getItem("token");

const EditBio = () => {
  const { existingBio, setBioActive } = useContext<GlobalContext>(UserContext);
  const [bioLength, setBioLength] = useState<number>(existingBio!?.length);
  const [updateBio, setUpdateBio] = useState<string>(existingBio!);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(existingBio);

  //update bio

  const updateBioPUT = async () => {
    setLoading(!false);
    const res = await axios.put(
      `http://localhost:1000/jot-users?bioUpdate=true&userId=${token}&updatedBio=${updateBio}`
    );
    if (res.data == true) {
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 2000);
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    window.themeCheck(token);
  }, []);
  return (
    <>
      <div className="full__blur--wrapper">
        <div className="update__bio--container">
          {loading == false ? (
            <div className="update__bio--loading--wrapper">
              <div className="update__bio--upper">
                <h3>Update Your Bio</h3>
                <div className="edit__button--wrapper">
                  <Button
                    content={
                      updateBio == existingBio
                        ? "fa-solid fa-xmark"
                        : "fa-regular fa-pen-to-square"
                    }
                    action={
                      updateBio == existingBio ? setBioActive : updateBioPUT
                    }
                    optionalValue={updateBio == existingBio ? false : undefined}
                    icon={!false}
                    inactive={!false}
                  />
                </div>
              </div>
              <div className="update__bio--middle">
                <textarea
                  name="update__bio"
                  id="update__bio"
                  defaultValue={existingBio}
                  onChange={(e) => {
                    setBioLength(e.currentTarget.value.length);
                    setUpdateBio(e.currentTarget.value);
                  }}
                  maxLength={250}
                  spellCheck="true"
                ></textarea>
                <InputCounter propLength={bioLength} />
              </div>
            </div>
          ) : (
            <ComponentLoader />
          )}
        </div>
      </div>
    </>
  );
};
export default EditBio;
