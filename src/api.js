// src/api.js
export async function joinMeeting(name) {
  const resp = await fetch(`${import.meta.env.VITE_BACKEND}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!resp.ok) throw new Error("Error al unirse");
  return await resp.json();
}

