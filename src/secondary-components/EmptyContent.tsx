import { useEffect, useState } from "react";
import logo from "../assets/jot-logo.png";
import emptyData from "../staticdata/EmptyData";

type EmnptyDataProp = {
  data?: {
    id: number;
    message?: string;
    title?: string;
    img?: string;
    icon?: boolean;
    row?: boolean;
  };
  menuSelection?: number;
  height?: string;
};

const EmptyContent = ({ data, menuSelection, height }: EmnptyDataProp) => {
  const [selectedMenu, setSelectedMenu] = useState<any>();

  const dataCheck = () => {
    const selectedMenu = emptyData.find((data) => data.id == menuSelection);

    setSelectedMenu(selectedMenu?.message);
  };

  useEffect(() => {
    dataCheck();
  }, [menuSelection]);
  return (
    <>
      <div
        className="empty__content--container"
        style={
          height
            ? { height: height }
            : undefined || data?.row
            ? { flexDirection: "row", gap: "0" }
            : undefined
        }
      >
        <h3>{data!?.title}</h3>
        {data!.img ? (
          <div className="empty__content--img--container">
            {data?.icon == false ? (
              <img
                src={data!?.img != "logo" ? data?.img : logo}
                alt="jot-logo"
                id="empty__content--img"
              />
            ) : (
              <i className={data?.img}></i>
            )}
          </div>
        ) : null}

        <p>{selectedMenu ? selectedMenu : data!?.message}</p>
      </div>
    </>
  );
};
export default EmptyContent;
