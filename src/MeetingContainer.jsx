import React, { useState } from "react";
import { joinMeeting } from "./api";
import VideoCall from "./VideoCall";

export default function MeetingContainer() {
  const [meetingData, setMeetingData] = useState(null);
  const [name, setName] = useState("");

  const handleJoin = async () => {
    if (!name) return alert("Ingresa tu nombre");
    const data = await joinMeeting(name);
    setMeetingData(data.meetingData || data);
  };

  if (meetingData) return <VideoCall meetingData={meetingData} name={name} />;
  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl w-96 flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Unirse a la reunión</h2>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
      />
      <button onClick={handleJoin} className="w-full py-3 bg-blue-600 text-white rounded-lg">
        🚀 Unirse
      </button>
    </div>
  );
}


