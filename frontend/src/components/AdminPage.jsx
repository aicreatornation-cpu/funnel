import { useEffect, useState } from 'react';
import { getLeads } from '../leads';

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

// NOTE: this is a simple client-side gate. The password ships in the frontend
// bundle, so it deters casual access but is NOT real security. For proper
// protection the password check (and the /api/leads endpoint) must be moved
// server-side.
const ADMIN_PASSWORD = 'tts123$';

const goBack = () => {
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// Password-only login screen.
function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('tts_admin', 'ok');
      onSuccess();
    } else {
      setErr('Incorrect password');
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-sub">Enter the password to view leads.</p>
        <input
          type="password"
          className={`admin-login-input${err ? ' invalid' : ''}`}
          placeholder="Password"
          value={pw}
          autoFocus
          onChange={(e) => { setPw(e.target.value); if (err) setErr(''); }}
        />
        {err && <div className="admin-login-err">{err}</div>}
        <button type="submit" className="admin-login-btn">Sign in</button>
        <button type="button" className="admin-login-back" onClick={goBack}>← Back to site</button>
      </form>
    </div>
  );
}

// Admin view (route: /admin) — password-gated list of leads from Supabase.
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('tts_admin') === 'ok');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setLeads(await getLeads());
    } catch (e) {
      setError('Could not load leads. Is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  const logout = () => {
    sessionStorage.removeItem('tts_admin');
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <div className="admin">
      <div className="admin-bar">
        <div>
          <h1 className="admin-title">Leads <span>{leads.length}</span></h1>
          <p className="admin-sub">People who entered their booking details.</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn" onClick={load}>↻ Refresh</button>
          <button className="admin-btn" onClick={logout}>Log out</button>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : error ? (
        <div className="admin-empty">{error}</div>
      ) : leads.length === 0 ? (
        <div className="admin-empty">
          No leads yet. Complete a booking on the site and it will appear here.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>When</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Video Type</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>UPI ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.id}>
                  <td>{leads.length - i}</td>
                  <td>{fmtDate(l.createdAt)}</td>
                  <td>{l.name || '—'}</td>
                  <td>{l.phone || '—'}</td>
                  <td>{l.videoType || '—'}</td>
                  <td>{l.duration || '—'}</td>
                  <td className="gold">{l.amount || '—'}</td>
                  <td>{l.upiId || '—'}</td>
                  <td>
                    <span className={`admin-status${l.status === 'Paid' ? ' paid' : ''}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
