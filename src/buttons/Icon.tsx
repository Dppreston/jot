type IconProps = {
  icon: string;
  shape?: boolean;
  fontSize?: string;
  color?: string;
  width?: string;
  height?: string;
  background?: string;
};

const Icon = ({
  icon,
  shape,
  color,
  fontSize,
  width,
  height,
  background,
}: IconProps) => {
  return (
    <>
      <div
        className="icon__container"
        style={
          shape
            ? {
                padding: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "var(--border)",
                borderRadius: "var(--outer--br)",
                background: background,
                width: width,
                height: height,
                boxShadow: "var(--box-shadow)",
              }
            : undefined
        }
      >
        <i
          className={`icon__main ${icon}`}
          style={{ fontSize: fontSize, color: color }}
        ></i>
      </div>
    </>
  );
};
export default Icon;
