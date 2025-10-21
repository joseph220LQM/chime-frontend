// VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { Conversation } from "@elevenlabs/client";

export default function VideoCall({ meetingData, name }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioBotRef = useRef(null);
  const [meetingSession, setMeetingSession] = useState(null);
  const [mozartActive, setMozartActive] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [localStream, setLocalStream] = useState(null);

  // 🔹 Inicializa la reunión y Mozart automáticamente
  useEffect(() => {
    if (!meetingData) return;

    const logger = new ConsoleLogger("ChimeLogs", LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const config = new MeetingSessionConfiguration(meetingData.Meeting, meetingData.Attendee);
    const session = new DefaultMeetingSession(config, logger, deviceController);
    setMeetingSession(session);

    async function initDevices() {
      // Acceso real a cámara y micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      videoRef.current.srcObject = stream;

      const audioInputs = await session.audioVideo.listAudioInputDevices();
      const videoInputs = await session.audioVideo.listVideoInputDevices();
      if (audioInputs.length) await session.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
      if (videoInputs.length) await session.audioVideo.chooseVideoInputDevice(videoInputs[0].deviceId);

      session.audioVideo.bindAudioElement(audioRef.current);
      session.audioVideo.startLocalVideoTile();
      session.audioVideo.bindVideoElement(1, videoRef.current);
      session.audioVideo.start();

      // 🚀 Conectamos Mozart automáticamente al finalizar setup
      await connectMozart();
    }

    initDevices();
  }, [meetingData]);

  // 🔹 Conexión con Mozart (automática)
  async function connectMozart() {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND}/api/get-conversation-token`);
      const { token } = await resp.json();
      const conv = await Conversation.startSession({
        agentId: import.meta.env.VITE_AGENT_ID,
        connectionType: "webrtc",
        conversationToken: token,
      });
      conv.addEventListener("track", (event) => {
        audioBotRef.current.srcObject = event.stream;
      });
      console.log("🤖 Mozart conectado automáticamente");
      setMozartActive(true);
    } catch (err) {
      console.error("❌ Error al conectar con Mozart:", err);
    }
  }

  // 🔹 Apagar cámara realmente
  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => (track.enabled = !cameraEnabled));
    setCameraEnabled(!cameraEnabled);
  };

  // 🔹 Apagar micrófono realmente
  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => (track.enabled = !micEnabled));
    setMicEnabled(!micEnabled);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-xl w-[400px]">
      <h2 className="text-xl font-bold text-gray-800">🎥 Reunión de {name}</h2>

      <video ref={videoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg" />
      <audio ref={audioRef} autoPlay />
      <audio ref={audioBotRef} autoPlay />

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            cameraEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {cameraEnabled ? "📷 Desactivar Cámara" : "📸 Activar Cámara"}
        </button>

        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            micEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {micEnabled ? "🎤 Silenciar Micrófono" : "🎙️ Activar Micrófono"}
        </button>

        {mozartActive && (
          <div className="text-purple-700 font-semibold text-center">
            🤖 Mozart conectado automáticamente
          </div>
        )}
      </div>
    </div>
  );
}





