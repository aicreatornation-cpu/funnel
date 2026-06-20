import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

// Connect to Supabase Postgres. Credentials come from .env (never the frontend).
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

// Create the leads table on first run.
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id          BIGSERIAL PRIMARY KEY,
      name        TEXT,
      phone       TEXT,
      video_type  TEXT,
      duration    TEXT,
      amount      TEXT,
      upi_id      TEXT,
      status      TEXT DEFAULT 'Details entered',
      created_at  TIMESTAMPTZ DEFAULT now()
    );
  `);
}

// DB row → camelCase shape the frontend expects.
const toLead = (r) => ({
  id: String(r.id),
  name: r.name,
  phone: r.phone,
  videoType: r.video_type,
  duration: r.duration,
  amount: r.amount,
  upiId: r.upi_id,
  status: r.status,
  createdAt: r.created_at,
});

// List all leads (newest first).
app.get('/api/leads', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(rows.map(toLead));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Capture a new lead.
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, videoType, duration, amount } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO leads (name, phone, video_type, duration, amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, phone, videoType, duration, amount],
    );
    res.json(toLead(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update a lead (status / upiId after payment).
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { status, upiId } = req.body;
    const { rows } = await pool.query(
      `UPDATE leads
         SET status = COALESCE($2, status),
             upi_id = COALESCE($3, upi_id)
       WHERE id = $1 RETURNING *`,
      [req.params.id, status ?? null, upiId ?? null],
    );
    res.json(rows[0] ? toLead(rows[0]) : null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Clear all leads.
app.delete('/api/leads', async (req, res) => {
  try {
    await pool.query('DELETE FROM leads');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
init()
  .then(() => app.listen(PORT, () => console.log(`Leads API running on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('Database init failed:', e.message);
    process.exit(1);
  });
