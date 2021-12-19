import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import "./index.css";

const AudioBubble = ({ className, style, data, bigEnough, stop, setStop }) => {
  const [play, setPlay] = useState(false);
  const [playNext, setPlayNext] = useState(false);
  const [audio, setAudio] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setAudio(new Audio(data.src));
  }, [data.src]);

  useEffect(() => {
    if (!audio) return;
    const metadataLoaded = (e) => {};

    const playbackEnded = () => {
      setPlay(false);
      setFinished(true);
    };

    const timeUpdated = (e) => {};

    audio.addEventListener("loadedmetadata", metadataLoaded);
    audio.addEventListener("ended", playbackEnded);
    audio.addEventListener("timeupdate", timeUpdated);
    return () => {
      audio.removeEventListener("loadedmetadata", metadataLoaded);
      audio.removeEventListener("ended", playbackEnded);
      audio.removeEventListener("timeupdate", timeUpdated);
    };
  }, [audio]);

  useEffect(() => {
    if (!audio) return;

    if (play) audio.play();
    else audio.pause();
  }, [play, audio]);

  useEffect(() => {
    if (!finished) return;

    setFinished(false);
  }, [finished]);

  useEffect(() => {
    if (!stop) return;

    console.log("Stopping all");
    setStop(false);
    if (!play) return;
    setPlay(false);

    setFinished(true);
  }, [play, setStop, stop]);

  useEffect(() => {
    if (stop || play || !playNext) return;

    console.log("Playing next");
    setPlay(true);
    setPlayNext(false);
  }, [stop, playNext, play]);
  const fillStyle = {
    backgroundColor: data.color.foreground,
    animationDuration: audio ? audio.duration / 2 + "s" : "0s",
  };

  const playAudio = () => {
    console.log("playing audio");
    if (!play) {
      setStop(true);
      setPlayNext(true);
    } else setPlay(false);
  };

  return (
    <Link
      style={style}
      className={"bubble " + className}
      to={`${"/audio_detail/"}${data.id}`}
    >
      {bigEnough && (
        <>
          <div className="content" style={style}>
            <button
              onClick={(e) => {
                e.preventDefault();
                playAudio();
              }}
            >
              {play ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
            </button>
            <p>{data.title}</p>
          </div>
          {audio && !finished && (
            <div className={"track-wrapper " + (play ? "" : "transparent")}>
              <div className="hold left">
                <div
                  className={"fill" + (play ? "" : " pause")}
                  style={{
                    ...fillStyle,
                  }}
                ></div>
              </div>
              <div className="hold right">
                <div
                  className={"fill" + (play ? "" : " pause")}
                  style={{
                    ...fillStyle,
                    animationDelay: audio.duration / 2 + "s",
                  }}
                ></div>
              </div>
            </div>
          )}
        </>
      )}
    </Link>
  );
};

const CategoryBubble = ({ className, style, prefix, data, bigEnough }) => {
  return (
    <Link
      className={"bubble " + className}
      style={style}
      to={`${prefix === "" ? "/" : `/${prefix}/`}${data.id}`}
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
      bigEnough={big_enough}
      data={data}
      style={style}
      stop={stop}
      setStop={setStop}
    />
  );
};

export default Bubble;
