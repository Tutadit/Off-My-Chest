import React, { useState } from "react";
import Recorder from "../Recorder";

import "./index.css";

const NewPost = () => {
  const [audio, setAudio] = useState(null);
  const [title, setTitle] = useState("");

  const submit = () => {
    if (title === "" || !audio) return
    
  };

  return (
    <div className="new-post">
      <input
        placeholder="Title"
        className="post-name"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Recorder className="recorder" audio={audio} setAudio={setAudio} />
      {audio && (
        <button onClick={submit} className="submit">
          Post
        </button>
      )}
    </div>
  );
};

export default NewPost;
