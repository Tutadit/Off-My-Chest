import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CommentSection } from "react-comments-section";
import { getAudio, getComments } from "../../database";

import "react-comments-section/dist/index.css";

import "./index.css";

const Audio = () => {
  let { audioID } = useParams();
  const { title, src, transcript } = getAudio(audioID);
  const [comments, setComments] = useState(getComments(audioID));
  const userId = "01a";
  const avatarUrl = "https://ui-avatars.com/api/name=Riya&background=random";
  const name = "xyz";
  const signinUrl = "/signin";
  const signupUrl = "/signup";
  let count = 0;
  comments.map((comment) => {
    count += 1;
    comment.replies && comment.replies.map((i) => (count += 1));
    return comment;
  });

  return (
    <div className="audio">
      <h1>{title}</h1>
      <div className="audio-wrapper">
        <audio controls>
          <source src={src} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="transcript-wrapper">
          <p>{transcript}</p>
      </div>
      <div className="comment-section">
        <div className="header">{count} Comments</div>
        <CommentSection
          currentUser={
            userId && { userId: userId, avatarUrl: avatarUrl, name: name }
          }
          commentsArray={comments}
          setComment={setComments}
          signinUrl={signinUrl}
          signupUrl={signupUrl}
        />
      </div>
    </div>
  );
};

export default Audio;
