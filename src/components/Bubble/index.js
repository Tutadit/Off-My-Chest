import React from "react";

import { Link, useNavigate } from "react-router-dom";

import AudioBubble from "../AudioBubble";
import "./index.css";

const CategoryBubble = ({ className, style, prefix, data, bigEnough }) => {
  return (
    <Link
      className={"bubble " + className}
      style={style}
      to={`${prefix === "" ? "/" : `/${prefix}/`}${data.pid}`}
    >
      {bigEnough && data.title}
    </Link>
  );
};

const Bubble = ({
  data,
  className,
  bubbleSize,
  minSize,
  prefix = "",
  stop = null,
  setStop = null,
  ...props
}) => {
  const big_enough = bubbleSize > minSize + 30;
  const category = data.category;
  const style = {
    backgroundColor: data.color.background,
    color: data.color.foreground,
  };

  let navigate = useNavigate()

  if (category)
    return (
      <CategoryBubble
        className={className}
        bigEnough={big_enough}
        prefix={prefix}
        data={data}
        style={style}
      />
    );

  return (
    <AudioBubble
      className={className}
      src={data.audio_file}      
      background={data.color.background}
      foreground={data.color.foreground}
      stop={stop}
      setStop={setStop}
      onClick={() => { 
        navigate(`/audio_detail/${data.pid}`)
      }}
    >
        {big_enough && (
          <p>{data.title}</p>
        )}
    </AudioBubble>
  );
};

export default Bubble;
