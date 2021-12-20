import React, { useState, useEffect } from "react";

import { FaReply } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { BsFillStopCircleFill, BsTrashFill } from "react-icons/bs";

import { makeid } from "../../Utilities";

import AudioBubble from "../AudioBubble";

import "./index.css";

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
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [durationInterval, setDurationInterval] = useState(null);

  useEffect(() => {
    if (!mediaStream) return;

    let chunks = [];

    const mediaStopped = (e) => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      const audio = window.URL.createObjectURL(blob);
      setRecordedAudio(audio);
    };

    const dataAvalibale = (e) => {
      chunks.push(e.data);
    };

    const recorder = new MediaRecorder(mediaStream);
    recorder.ondataavailable = dataAvalibale;
    recorder.onstop = mediaStopped;
    setMediaRecorder(recorder);
  }, [mediaStream]);

  const stopDurationInterval = () => {
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
  };

  const launchDurationInterval = () => {
    stopDurationInterval();
    setDurationInterval(
      setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000)
    );
  };

  useEffect(() => {
    const stop = () => {
      if (durationInterval) {
        clearInterval(durationInterval);
        setDurationInterval(null);
      }
    };
    const launch = () => {
      stop();
      setDurationInterval(
        setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000)
      );
    };

    if (!mediaRecorder) return;

    if (recording && mediaRecorder.state === "inactive") {
      mediaRecorder.start(100);
      launch();
    } else if (!recording && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      stop();
    }
  }, [duration, durationInterval, mediaRecorder, paused, recording]);

  const initiateMediaRecorder = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (stream) {
        setMediaStream(stream);
      });
  };

  const handleRecord = (e) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    if (!mediaRecorder) initiateMediaRecorder();
    setRecording(!recording);
  };

  const resetRecording = (e) => {
    setRecordedAudio(null);
    setDuration(0);
  };

  const pause = (e) => {
    if (!mediaRecorder) return;

    if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setPaused(false);
      launchDurationInterval();
    } else {
      mediaRecorder.pause();
      stopDurationInterval();
      setPaused(true);
    }
  };

  const resetForm = () => {
    resetRecording();
    setName("");
    setReplyText("");
    setReply(false);
  };

  const sendAudio = () => {
    if (!recordedAudio) return;

    sendComment(
      {
        userId: "02a",
        comId: makeid(3),
        fullName: name,
        avatarUrl: "https://ui-avatars.com/api/name=Adam&background=random",
        audio: recordedAudio,
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
            <div className="recording-studio">
              {recordedAudio ? (
                <div className="results">
                  <AudioBubble
                    className={"audio-bubble"}
                    src={recordedAudio}
                    background={"rgb(10, 129, 107)"}
                    foreground={"rgb(8, 12, 11)"}
                    stop={stop}
                    setStop={setStop}
                  >
                    <button className="delete-audio" onClick={resetRecording}>
                      <BsTrashFill />
                    </button>
                  </AudioBubble>
                </div>
              ) : (
                <div className="controls">
                  {recording ? (
                    <>
                      <button className="recorder-btn" onClick={pause}>
                        {paused ? <AiFillPlayCircle /> : <AiFillPauseCircle />}
                      </button>
                      <button className="recorder-btn" onClick={handleRecord}>
                        <BsFillStopCircleFill />
                      </button>
                      <p>
                        {new Date(duration * 1000).toISOString().substr(11, 8)}
                      </p>
                    </>
                  ) : (
                    <button className="recorder-btn" onClick={handleRecord}>
                      <MdKeyboardVoice />
                    </button>
                  )}
                </div>
              )}
            </div>
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
