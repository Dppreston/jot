import { useContext } from "react";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";

type ConfirmProps = {
  content?: string;
  confirmAction?: Function;
  secondAction?: Function;
  secondOptionalValue?: boolean;
};

const ConfirmPopup = ({
  content,
  confirmAction,
  secondAction,
}: ConfirmProps) => {
  const { setConfirmActive } = useContext<GlobalContext>(UserContext);
  return (
    <>
      <div className="full__blur--wrapper">
        <div className="confirm__container">
          <h4>{content}</h4>
          <div className="confirm__button--container">
            <Button
              content={"Cancel"}
              color="black"
              background="var(--hover-DM)"
              inactive={!false}
              action={setConfirmActive}
              optionalValue={false}
            />
            <Button
              content={"Confirm"}
              background="var(--input-error)"
              inactive={!false}
              action={confirmAction}
              secondAction={secondAction}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmPopup;
