import { GlobalContext, UserContext } from "../App";
import categories from "../staticdata/Categories";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Button from "../buttons/ButtonMain";
import ComponentLoader from "../loaders/ComponentLoader";

const token: string | null = localStorage.getItem("token");

type Category = {
  id?: number;
  title?: string;
  icon?: string;
};

const UpdateFavorites = () => {
  const { darkActive, setChangeFavoritesActive, userFavoritesForUpdate } =
    useContext<GlobalContext>(UserContext);

  const [updatedSelected, setUpdatedSelected] = useState<Category[]>(
    categories?.filter((data) =>
      userFavoritesForUpdate!?.some((test: number) => test == data.id)
    )
  );
  const [updatedDeselected, setUpdatedDeselected] = useState<Category[]>(
    categories?.filter(
      (data) =>
        !userFavoritesForUpdate!?.some((test: number) => test == data.id)
    )
  );
  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //removing favorite && adding to unselected

  const removeFavorite = (data: Category) => {
    const remove = updatedSelected?.filter((el) => el.id != data.id);
    const add = updatedSelected?.filter((el) => el.id == data.id);
    if (add) {
      updatedDeselected.push(...add);
    }
    setUpdatedSelected(remove);
    setChanged(!false);
  };

  //add favorite && remove from deselected

  const addFavorite = (data: Category) => {
    const add = updatedDeselected.filter((el) => el.id == data.id);
    const remove = updatedDeselected.filter((el) => el.id != data.id);
    if (add) {
      updatedSelected.push(...add);
    }
    setUpdatedDeselected(remove);
    setChanged(!false);
  };

  //update favorite categories

  const updateLikedCategories = async () => {
    const ids = updatedSelected.flatMap((data) => data.id);
    setLoading(!false);

    const res = await axios.put(
      `/jot-users?updateFavoriteCategories=true&userId=${token}&updatedFavorites=${ids}`
    );

    if (res.data == true) {
      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    darkActive == !false ? window.darkMode() : null;
  }, [updatedSelected, updatedDeselected]);

  return (
    <>
      <div className="full__blur--wrapper">
        <div className="update__favorites--container">
          {loading == false ? (
            <div className="update__favorites--loading--container">
              <div className="update__favorites--top--container">
                <h3>Update Your Favorites</h3>
                <div className="edit__button--wrapper">
                  <Button
                    content={
                      changed == false
                        ? "fa-solid fa-xmark"
                        : "fa-regular fa-pen-to-square"
                    }
                    action={
                      changed == false
                        ? setChangeFavoritesActive
                        : updatedSelected.length != 0
                        ? updateLikedCategories
                        : undefined
                    }
                    icon={!false}
                    optionalValue={changed == false ? false : undefined}
                    inactive={!false}
                  />
                </div>
              </div>
              <div className="current__favorites--wrapper">
                <div className="subtitle__container">
                  <p className="favorites__subtitle">Current Favorites</p>
                  <p
                    className="selected__count"
                    style={
                      updatedSelected.length == 8
                        ? { color: "var(--input-error)" }
                        : undefined || updatedSelected.length == 0
                        ? { color: "var(--input-error)" }
                        : undefined
                    }
                  >
                    {updatedSelected!?.length}/8
                  </p>
                </div>
                <div className="current__favorites--container">
                  {updatedSelected!?.map((data) => (
                    <div className="favorites__tile" key={data.id}>
                      <i className={data.icon}></i>
                      <p>{data.title}</p>
                      <button
                        id="remove__favorite--cat"
                        onClick={() => removeFavorite(data)}
                      >
                        <i className="fa-solid fa-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="unselected__wrapper">
                <div className="subtitle__container">
                  <p className="favorites__subtitle">Unselected Categories</p>

                  <p className="selected__count">
                    {updatedDeselected!?.length > 0
                      ? updatedDeselected!?.length
                      : null}
                    /{categories.length}
                  </p>
                </div>
                <div className="unselected__category--container">
                  {updatedDeselected!?.length > 0
                    ? updatedDeselected!?.map((data) => (
                        <div className="favorites__tile" key={data.id}>
                          <i className={data.icon}></i> <p>{data.title}</p>
                          <button
                            id="add__favorite--cat"
                            onClick={() => {
                              if (updatedSelected.length < 8) {
                                addFavorite(data);
                              }
                            }}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      ))
                    : null}
                </div>
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
export default UpdateFavorites;
