// src/api.js
export async function joinMeeting(name) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Error al unirse a la reunión");
  }

  return await response.json(); // { Meeting, Attendee }
}
