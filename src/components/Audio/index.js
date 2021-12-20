import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../CommentSection";
import { getAudio, getComments } from "../../database";
import AudioBubble from "../AudioBubble";
import { CgTranscript } from "react-icons/cg";
import Back from "../Back";
import "./index.css";

const Audio = () => {
  let { audioID } = useParams();
  const { title, src, transcript } = getAudio(audioID);
  const [comments, setComments] = useState(getComments(audioID));
  const [count, setCount] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [stop, setStop] = useState(false);

  useEffect(() => {
    let total = 0;

    const countComments = (comments) => {
      comments.map((comment) => {
        total += 1;
        comment.replies && countComments(comment.replies);
        return comment;
      });
    };
    countComments(comments);
    setCount(total);
  }, [comments]);

  return (
    <div className="audio">
      <div className="header">
        <Back />
        <h1>{title}</h1>
      </div>
      <div className="audio-wrapper">
        <AudioBubble
          className={"audio-bubble"}
          src={src}
          background={"rgb(10, 129, 107)"}
          foreground={"rgb(8, 12, 11)"}
          stop={stop}
          setStop={setStop}
        />
      </div>
      {showTranscript && (
        <div className="transcript-wrapper">
          <p>{transcript}</p>
        </div>
      )}
      <button
        className="icon-btn"
        onClick={() => setShowTranscript((prev) => !prev)}
      >
        <CgTranscript /> {showTranscript ? "Hide" : "View"} Transcript
      </button>

      <div className="comment-section">
        <div className="header">{count} Comments</div>
        <CommentSection
          comments={comments}
          setComments={setComments}
          stop={stop}
          setStop={setStop}
        />
      </div>
    </div>
  );
};

export default Audio;
