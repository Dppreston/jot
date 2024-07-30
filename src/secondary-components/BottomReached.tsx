import Button from "../buttons/ButtonMain";

const BottomReached = ({ handleBottomClick }: any) => {
  return (
    <>
      <div className="bottom__reached--container">
        <Button
          content="Back to top"
          inactive={!false}
          action={handleBottomClick}
          optionalValue={true}
        />
      </div>
    </>
  );
};
export default BottomReached;
