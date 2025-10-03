import React, { useState } from "react";
import { joinMeeting } from "./api";
import VideoCall from "./VideoCall";

export default function MeetingContainer() {
  const [meetingData, setMeetingData] = useState(null);
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState([]);

  const handleJoin = async () => {
    if (!name) return alert("Ingresa tu nombre");

    try {
      const data = await joinMeeting(name);
      setMeetingData(data);
      setParticipants((prev) => [...prev, name]);
    } catch (err) {
      console.error("❌ Error al unirse:", err);
    }
  };

  if (meetingData) {
    return (
      <VideoCall
        meetingData={meetingData}
        name={name}
        participants={participants}
      />
    );
  }

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl w-96 flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Unirse a la reunión</h2>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
      />
      <button
        onClick={handleJoin}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105"
      >
        🚀 Unirse
      </button>
    </div>
  );
}

