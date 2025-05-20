require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');

const app = express();
app.use(cors());
app.use(express.json());

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN
});

db.execute(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT,
    timestamp TEXT,
    charges TEXT,
    payment TEXT
  );
`);

app.post('/entries', async (req, res) => {
  const { name, age, gender, charges, payment } = req.body;

  try {
    await db.execute({
      sql: `INSERT INTO entries (name, age, gender, timestamp, charges, payment) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [name, age, gender, new Date().toISOString(), charges, payment],
    });

    res.status(200).json({ message: "Data inserted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/entries', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM entries');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


  