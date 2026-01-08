const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchRecommendations(profile) {
  const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al obtener recomendaciones");
  }

  return res.json();
}
  