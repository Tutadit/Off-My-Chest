import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import AudioBubble from "../AudioBubble";
import "./index.css";

const CategoryBubble = ({ className, style, onClick, data }) => {
  return (
    <button className={"bubble " + className} style={style} onClick={onClick}>
      {data.title}
    </button>
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
  const [go, setGo] = useState(false);
  let navigate = useNavigate();

  const category = data.category;
  const style = {
    backgroundColor: data.color.background,
    color: data.color.foreground,
  };

  useEffect(() => {
    const to = category
      ? `${prefix === "" ? "/" : `/${prefix}/`}${data.pid}`
      : `/audio_detail/${data.pid}`;

    if (!stop && go) {
      setGo(false);
      navigate(to);
    }
  }, [category, data.pid, go, navigate, prefix, stop]);

  const travel = () => {
    setGo(true);
    setStop(true);
  };


  const keywords = data?.nlu_analysis?.result?.keywords
    ? data.nlu_analysis.result.keywords.slice(0,2).map((keyword) => (
        <span className="keyword">{keyword.text.substring(0,10)}</span>
      ))
    : [];

  if (category)
    return (
      <CategoryBubble
        className={className}
        data={data}
        style={style}
        onClick={travel}
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
      onClick={travel}
      children={<div className="keywords">{keywords}</div>}
    />
  );
};

export default Bubble;
