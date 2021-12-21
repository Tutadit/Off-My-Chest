import React, { useState, useEffect } from "react";

import { FaReply } from "react-icons/fa";

import AudioBubble from "../AudioBubble";

import "./index.css";
import Recorder from "../Recorder";

const NewComment = ({
  title,
  parent = null,
  newComment,
  onReset,
  stop,
  setStop,
}) => {
  const [replyWithAudio, setReplyWithAudio] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [name, setName] = useState("");
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");

  const resetForm = () => {
    setName("");
    setReplyText("");
    onReset && onReset();
  };

  const sendAudio = () => {
    if (!audio) return;

    newComment(
      {
        fullName: name,
        audio: audio,
        transcript:transcript
      },
      parent
    );
    resetForm();
  };

  const sendText = () => {
    if (!replyText) return;

    newComment(
      {
        fullName: name,
        text: replyText,
      },
      parent
    );
    resetForm();
  };

  const sendReply = () => {
    if (name === "") return;
    if (replyWithAudio) {
      sendAudio();
    } else {
      sendText();
    }
  };

  return (
    <div className="reply-form">
      <div className="header">
        <h2>{title}</h2>
        <button className="btn" onClick={resetForm}>
          Cancel
        </button>
      </div>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="reply-control">
        <p>Reply with:</p>
        <div className="reply-controls">
          <button
            className={(!replyWithAudio ? "active" : "") + " btn"}
            onClick={() => setReplyWithAudio(false)}
          >
            Text
          </button>
          <button
            className={(replyWithAudio ? "active" : "") + " btn"}
            onClick={() => setReplyWithAudio(true)}
          >
            Audio
          </button>
        </div>
      </div>
      {replyWithAudio ? (
        <Recorder
          stop={stop}
          setStop={setStop}
          audio={audio}
          setAudio={setAudio}
          transcript={transcript}
          setTranscript={setTranscript}
        />
      ) : (
        <textarea
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      )}
      <button className="btn" onClick={sendReply}>
        Reply
      </button>
    </div>
  );
};

const Comment = ({ comment, index, newComment, stop, setStop }) => {
  const [reply, setReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  return (
    <div className="comment">
      <div className="content">
        <div className="person">
          <img src={comment.avatarUrl} alt={comment.fullName} />
          <h1>{comment.fullName}</h1>
          <button className="plain" onClick={() => setReply(true)}>
            <FaReply />
          </button>
        </div>
        <div className="text">
          {comment.text && <p>{comment.text}</p>}
          {comment.audio && (
            <AudioBubble
              className={"audio-bubble"}
              src={comment.audio}
              background={"rgb(10, 129, 107)"}
              foreground={"rgb(8, 12, 11)"}
              stop={stop}
              setStop={setStop}
            />
          )}
        </div>
      </div>
      {reply && (
        <NewComment
          title={"Replying to " + comment.fullName}
          newComment={newComment}
          parent={comment.comId}
          onReset={() => setReply(false)}
          stop={stop}
          setStop={setStop}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <>
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="thread-btn"
          >
            <div className="line" />
            <p>
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length > 1 ? "replies" : "reply"}
            </p>
            <div className="line" />
          </button>
          {showReplies && (
            <Comments
              comments={comment.replies}
              newComment={newComment}
              stop={stop}
              setStop={setStop}
              subComment
            />
          )}
        </>
      )}
    </div>
  );
};

const Comments = ({ comments, newComment, stop, setStop, subComment }) => {
  return (
    <div className={"comments" + (subComment ? " sub-comment" : "")}>
      {comments.map((comment, i) => (
        <Comment
          key={comment.comId}
          comment={comment}
          index={i}
          newComment={newComment}
          stop={stop}
          setStop={setStop}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ comments, newComment, stop, setStop }) => {
  const [reply, setReply] = useState(false);
  const [count, setCount] = useState(0);

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
    <>
      <div className="comments-header">
        <div className="counter">{count} Comments</div>
        {!reply && (
          <button className="icon-btn" onClick={() => setReply(true)}>
            <FaReply /> Reply
          </button>
        )}
      </div>
      {reply && (
        <NewComment
          title={"Add Comment"}
          stop={stop}
          setStop={setStop}
          onReset={() => setReply(false)}
          newComment={newComment}
        />
      )}
      <Comments
        comments={comments}
        newComment={newComment}
        stop={stop}
        setStop={setStop}
      />
    </>
  );
};

export default CommentSection;
