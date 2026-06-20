// ---------------------------------------------------------------------------
// Lead store — talks to the Express API (../backend), which persists to
// Supabase Postgres. All functions are async and return promises.
// In dev, VITE_API_URL is empty and Vite proxies /api to the backend.
// In production, set VITE_API_URL to the deployed backend URL.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL || '';
const BASE = `${API_BASE}/api/leads`;

export async function getLeads() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to load leads');
  return res.json();
}

// Adds a lead and returns its generated id.
export async function addLead(lead) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error('Failed to save lead');
  const saved = await res.json();
  return saved.id;
}

export async function updateLead(id, patch) {
  await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function clearLeads() {
  await fetch(BASE, { method: 'DELETE' });
}
