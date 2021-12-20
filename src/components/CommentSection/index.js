import React, { useState, useEffect } from "react";

import { FaReply } from "react-icons/fa";

import { makeid } from "../../Utilities";

import AudioBubble from "../AudioBubble";

import "./index.css";
import Recorder from "../Recorder";

const Comment = ({
  comment,
  index,
  sendComment,
  setComments,
  stop,
  setStop,
}) => {
  const [replyWithAudio, setReplyWithAudio] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [name, setName] = useState("");

  const [audio, setAudio] = useState(null);

  const resetForm = () => {
    setName("");
    setReplyText("");
    setReply(false);
  };

  const sendAudio = () => {
    if (!audio) return;

    sendComment(
      {
        userId: "02a",
        comId: makeid(3),
        fullName: name,
        avatarUrl: "https://ui-avatars.com/api/name=Adam&background=random",
        audio: audio,
      },
      index
    );
    resetForm();
  };

  const sendText = () => {
    if (!replyText) return;

    sendComment(
      {
        userId: "02a",
        comId: makeid(12),
        fullName: name,
        avatarUrl: "https://ui-avatars.com/api/name=Adam&background=random",
        text: replyText,
      },
      index
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
    <div className="comment">
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
      {reply && (
        <div className="reply-form">
          <div className="header">
            <h2>Replying to {comment.fullName}</h2>
            <button
              className="btn"
              onClick={() => {
                setReply(false);
                setName("");
                setReplyText("");
              }}
            >
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
      )}
      {comment.replies && (
        <CommentSection
          comments={comment.replies}
          setComments={setComments}
          stop={stop}
          setStop={setStop}
        />
      )}
    </div>
  );
};

const CommentSection = ({ comments, setComments, stop, setStop }) => {
  const sendComment = (new_comment, to) => {
    if (!setComments) return;
    setComments((prev) =>
      prev.map((comment, i) => {
        if (i !== to) return comment;
        return {
          ...comment,
          replies: comment.replies
            ? [...comment.replies, new_comment]
            : [new_comment],
        };
      })
    );
  };

  const getSetComments = (index) => {
    return (change) => {
      setComments((pprev) =>
        pprev.map((comment, i) => {
          if (i !== index) return comment;
          return {
            ...comment,
            replies: change(comment.replies ? comment.replies : []),
          };
        })
      );
    };
  };

  return (
    <div className="comments">
      {comments.map((comment, i) => (
        <Comment
          key={comment.comId}
          comment={comment}
          index={i}
          sendComment={sendComment}
          setComments={getSetComments(i)}
          stop={stop}
          setStop={setStop}
        />
      ))}
    </div>
  );
};

export default CommentSection;
