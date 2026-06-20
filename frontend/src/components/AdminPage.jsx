import { useEffect, useState } from 'react';
import { getLeads, clearLeads } from '../leads';

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

// Admin view (route: #admin) — lists all captured leads from Supabase.
export default function AdminPage() {
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

  useEffect(() => { load(); }, []);

  const clearAll = async () => {
    if (!window.confirm('Delete all leads? This cannot be undone.')) return;
    try {
      await clearLeads();
      setLeads([]);
    } catch {
      setError('Failed to clear leads.');
    }
  };

  const goBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="admin">
      <div className="admin-bar">
        <div>
          <h1 className="admin-title">Leads <span>{leads.length}</span></h1>
          <p className="admin-sub">People who entered their booking details.</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn" onClick={load}>↻ Refresh</button>
          <button className="admin-btn danger" onClick={clearAll} disabled={!leads.length}>Clear all</button>
          <button className="admin-btn" onClick={goBack}>← Back to site</button>
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
