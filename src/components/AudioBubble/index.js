import React, { useState, useEffect } from "react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

import "../Bubble/index.css";

const AudioBubble = ({
  className,
  background,
  foreground,
  src,
  stop,
  setStop,
  children,
  onClick,
}) => {
  const [play, setPlay] = useState(false);
  const [playNext, setPlayNext] = useState(false);
  const [audio, setAudio] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setAudio(new Audio(src));
  }, [src]);

  useEffect(() => {
    if (!audio) return;
    const metadataLoaded = (e) => {
      
    };

    const playbackEnded = () => {
      setPlay(false);
      setFinished(true);
    };

    const timeUpdated = (e) => {};

    const anError = (e) => {
      console.log(e);
    };

    audio.addEventListener("loadedmetadata", metadataLoaded);
    audio.addEventListener("ended", playbackEnded);
    audio.addEventListener("timeupdate", timeUpdated);
    audio.addEventListener("error", anError);
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
    if (!stop || !setStop) return;

    setStop(false);
    if (!play) return;
    setPlay(false);

    setFinished(true);
  }, [play, setStop, stop]);

  useEffect(() => {
    if (stop || play || !playNext) return;

    setPlay(true);
    setPlayNext(false);
  }, [stop, playNext, play]);
  const fillStyle = {
    backgroundColor: foreground,
    animationDuration: audio ? audio.duration / 2 + "s" : "0s",
  };

  const playAudio = () => {
    if (!play && setStop) {
      setStop(true);
      setPlayNext(true);
    } else if (!play) {
      setPlay(true);
    } else setPlay(false);
  };

  return (
    <div
      className={"bubble " + className}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="content"
        style={{
          backgroundColor: background,
          color: foreground,
        }}
      >
        <button
          className="player"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playAudio();
          }}
        >
          {play ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
        </button>
        {children}
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
    </div>
  );
};

export default AudioBubble;
