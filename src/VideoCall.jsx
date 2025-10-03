import React, { useEffect, useRef, useState } from "react";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";

export default function VideoCall({ meetingData, name, participants }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [meetingSession, setMeetingSession] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    if (!meetingData) return;

    const logger = new ConsoleLogger("ChimeLogs", LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);

    const configuration = new MeetingSessionConfiguration(
      meetingData.Meeting,
      meetingData.Attendee
    );

    const session = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );

    setMeetingSession(session);

    async function initDevices() {
      const audioInputs = await session.audioVideo.listAudioInputDevices();
      const videoInputs = await session.audioVideo.listVideoInputDevices();

      if (audioInputs.length > 0) await session.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
      if (videoInputs.length > 0) await session.audioVideo.chooseVideoInputDevice(videoInputs[0].deviceId);

      session.audioVideo.bindAudioElement(audioRef.current);
      session.audioVideo.startLocalVideoTile();
      session.audioVideo.bindVideoElement(1, videoRef.current);

      session.audioVideo.start();
    }

    initDevices();
  }, [meetingData]);

  const toggleMic = () => {
    if (!meetingSession) return;
    if (micOn) {
      meetingSession.audioVideo.realtimeMuteLocalAudio();
      setMicOn(false);
    } else {
      meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      setMicOn(true);
    }
  };

  const toggleCamera = () => {
    if (!meetingSession) return;
    if (cameraOn) {
      meetingSession.audioVideo.stopLocalVideoTile();
      setCameraOn(false);
    } else {
      meetingSession.audioVideo.startLocalVideoTile();
      setCameraOn(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-xl w-[400px]">
      <h2 className="text-xl font-bold text-gray-800">🎥 Reunión de {name}</h2>
      
      <div className="relative w-64 h-48 bg-black rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <audio ref={audioRef} autoPlay />
      </div>

      <div className="flex gap-4 mt-2">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-lg ${micOn ? "bg-green-600" : "bg-red-600"} text-white font-semibold shadow-md transition-all hover:scale-105`}
        >
          {micOn ? "Mic ON" : "Mic OFF"}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg ${cameraOn ? "bg-green-600" : "bg-red-600"} text-white font-semibold shadow-md transition-all hover:scale-105`}
        >
          {cameraOn ? "Cam ON" : "Cam OFF"}
        </button>
      </div>

      <div className="mt-4 w-full">
        <h3 className="font-semibold text-gray-700 mb-2">👥 Participantes</h3>
        <ul className="list-disc list-inside text-gray-600">
          {participants.map((p, i) => (
            <li key={i} className="py-1">{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}


