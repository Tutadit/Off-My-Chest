import { Link } from "react-router-dom";

import "./index.css";

const Bubble = ({ data, className, bubbleSize, minSize, ...props }) => {
  const big_enough = bubbleSize > minSize + 30;
  return (
    <Link
      className={"bubble " + className}
      style={{
        backgroundColor: data.color.background,
        color: data.color.foreground,
      }}
      to={`/audio/${data.id}`}
    >
      {big_enough && data.title}
    </Link>
  );
};

export default Bubble;
