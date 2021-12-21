import React, { useState } from "react";
import Recorder from "../Recorder";
import { useNavigate } from "react-router-dom";
import { addPost } from "../../database/firebase";
import "./index.css";

const NewPost = () => {
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");

  const navigate = useNavigate();
  const submit = () => {
    if (!audio) return;
    addPost(audio, transcript).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="new-post">
      <Recorder
        className="recorder"
        audio={audio}
        setAudio={setAudio}
        transcript={transcript}
        setTranscript={setTranscript}
      />
      {audio && (
        <button onClick={submit} className="submit">
          Post
        </button>
      )}
    </div>
  );
};

export default NewPost;
