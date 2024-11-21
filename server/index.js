const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const schedule = require('node-schedule');
const config = require('./config');

const app = express();
const db = new sqlite3.Database(config.databaseUrl);

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS toilet_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);
});

// Add employee
app.post('/api/employees', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO employees (name) VALUES (?)', [name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

// Get all employees
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Record toilet visit
app.post('/api/visits', (req, res) => {
  const { employeeId } = req.body;
  db.run('INSERT INTO toilet_visits (employee_id) VALUES (?)', [employeeId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Get today's summary
app.get('/api/summary', (req, res) => {
  const query = `
    SELECT 
      e.id,
      e.name,
      COUNT(v.id) as visit_count
    FROM employees e
    LEFT JOIN toilet_visits v 
      ON e.id = v.employee_id 
      AND DATE(v.timestamp) = DATE('now', 'localtime')
    GROUP BY e.id, e.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Schedule daily reset at 5 PM
schedule.scheduleJob('0 17 * * *', () => {
  db.run(`
    DELETE FROM toilet_visits 
    WHERE DATE(timestamp) < DATE('now', 'localtime')
  `);
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});