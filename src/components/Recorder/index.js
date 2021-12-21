import React, { useState, useEffect } from "react";

import { MdKeyboardVoice } from "react-icons/md";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { BsFillStopCircleFill, BsTrashFill } from "react-icons/bs";

import AudioBubble from "../AudioBubble";

import "./index.css";

const Recorder = ({ stop, setStop, audio, setAudio, className, transcript, setTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [durationInterval, setDurationInterval] = useState(null);

  const [recognition, setRecognition] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!mediaStream) return;

    let chunks = [];

    const mediaStopped = (e) => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      const new_audio = window.URL.createObjectURL(blob);
      setAudio(new_audio);
    };

    const dataAvalibale = (e) => {
      chunks.push(e.data);
    };

    const transcriptAvailable = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
        setTranscript(event.results[i][0].transcript + '.')
      }
    };

    const recorder = new MediaRecorder(mediaStream);
    let SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.lang = "en-US";
      recognizer.continuous = true;
      recognizer.interimResults = true;

      recognizer.onresult = transcriptAvailable;
      setRecognition(recognizer);
    }
    recorder.ondataavailable = dataAvalibale;
    recorder.onstop = mediaStopped;
    setMediaRecorder(recorder);
  }, [mediaStream, setAudio]);

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
      recognition && recognition.start();
      launch();
    } else if (!recording && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      recognition && recognition.stop();
      stop();
    }
  }, [
    duration,
    durationInterval,
    mediaRecorder,
    paused,
    recognition,
    recording,
  ]);

  const resetRecording = (e) => {
    setAudio(null);
    setDuration(0);
  };

  const handleRecord = (e) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    if (!mediaRecorder) initiateMediaRecorder();
    setRecording(!recording);
  };

  const initiateMediaRecorder = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (stream) {
        setMediaStream(stream);
      });
  };

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

  return (
    <div className={className + " recording-studio"}>
      {audio ? (
        <div className="results">
          <AudioBubble
            className={"audio-bubble"}
            src={audio}
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
              <p>{new Date(duration * 1000).toISOString().substr(11, 8)}</p>
            </>
          ) : (
            <button className="recorder-btn" onClick={handleRecord}>
              <MdKeyboardVoice />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Recorder;
