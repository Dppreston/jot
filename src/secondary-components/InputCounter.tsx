type LengthProp = {
  propLength?: number;
  createPostWordCount?: number;
};

const InputCounter = ({ propLength, createPostWordCount }: LengthProp) => {
  return (
    <>
      <p
        className="character__count"
        style={
          propLength == 250
            ? { color: "red" }
            : createPostWordCount && createPostWordCount == 500
            ? { color: "red" }
            : undefined
        }
      >
        {!createPostWordCount ? propLength : createPostWordCount} /{" "}
        {!createPostWordCount ? `250` : `500`}
      </p>
    </>
  );
};
export default InputCounter;
