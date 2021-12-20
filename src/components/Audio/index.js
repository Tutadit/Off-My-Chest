import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../CommentSection";
import { useAudio, useComments } from "../../database";
import AudioBubble from "../AudioBubble";
import { CgTranscript } from "react-icons/cg";
import Back from "../Back";
import Loading from "../Loading"
import "./index.css";

const Audio = () => {
  let { audioID } = useParams();
  const { audio, loading } = useAudio(audioID);
  
  const { comments, newComment } = useComments(audioID);

  const [showTranscript, setShowTranscript] = useState(false);
  const [stop, setStop] = useState(false);

  if (loading)
    return <Loading />

  return (
    <div className="audio">
      <div className="header">
        <Back plain />
      </div>
      <div className="audio-transcript">
        <div className="audio-wrapper">
          <AudioBubble
            className={"audio-bubble"}
            src={audio.audio_file}
            background={"rgb(10, 129, 107)"}
            foreground={"rgb(8, 12, 11)"}
            stop={stop}
            setStop={setStop}
          />
        </div>
        <button
          className="icon-btn"
          onClick={() => setShowTranscript((prev) => !prev)}
        >
          <CgTranscript /> {showTranscript ? "Hide" : "View"} Transcript
        </button>
      </div>
      {showTranscript && (
        <div className="transcript-wrapper">
          <p>{audio.transcript}</p>
        </div>
      )}
      <div className="comment-section">
        <CommentSection
          comments={comments}
          newComment={newComment}
          stop={stop}
          setStop={setStop}
        />
      </div>
    </div>
  );
};

export default Audio;
