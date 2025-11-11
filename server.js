const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to in-memory SQLite database');
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS workout_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      session_name TEXT,
      notes TEXT,

      -- Lift-specific fields
      lift_name TEXT,
      sets TEXT,
      unit TEXT,
      rpe INTEGER,

      -- Cardio-specific fields
      modality TEXT,
      duration INTEGER,
      distance REAL,
      distance_unit TEXT,
      avg_hr INTEGER,

      -- BJJ-specific fields
      technique TEXT,
      rounds INTEGER,
      round_length INTEGER,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database tables initialized');
      // Insert sample data
      insertSampleData();
    }
  });
}

// Insert sample data for testing
function insertSampleData() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const sampleEntries = [
    {
      type: 'lift',
      date: today,
      session_name: 'Push Day',
      lift_name: 'Bench Press',
      sets: JSON.stringify([
        { reps: 8, weight: 135 },
        { reps: 8, weight: 145 },
        { reps: 6, weight: 155 }
      ]),
      unit: 'lbs',
      rpe: 8,
      notes: 'Felt strong today!'
    },
    {
      type: 'cardio',
      date: yesterday,
      session_name: 'Morning Run',
      modality: 'Running',
      duration: 30,
      distance: 3.5,
      distance_unit: 'miles',
      avg_hr: 145,
      notes: 'Easy recovery run'
    },
    {
      type: 'bjj',
      date: yesterday,
      session_name: 'Evening Class',
      technique: 'Guard Passing',
      rounds: 6,
      round_length: 5,
      notes: 'Worked on pressure passing'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO workout_entries (
      type, date, session_name, lift_name, sets, unit, rpe,
      modality, duration, distance, distance_unit, avg_hr,
      technique, rounds, round_length, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleEntries.forEach(entry => {
    stmt.run(
      entry.type,
      entry.date,
      entry.session_name || null,
      entry.lift_name || null,
      entry.sets || null,
      entry.unit || null,
      entry.rpe || null,
      entry.modality || null,
      entry.duration || null,
      entry.distance || null,
      entry.distance_unit || null,
      entry.avg_hr || null,
      entry.technique || null,
      entry.rounds || null,
      entry.round_length || null,
      entry.notes || null
    );
  });

  stmt.finalize(() => {
    console.log('Sample data inserted');
  });
}

// API Routes

// Get all workout entries (sorted by date, newest first)
app.get('/api/entries', (req, res) => {
  db.all(`
    SELECT * FROM workout_entries
    ORDER BY date DESC, created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Parse sets JSON for lift entries
    const entries = rows.map(row => {
      if (row.type === 'lift' && row.sets) {
        try {
          row.sets = JSON.parse(row.sets);
        } catch (e) {
          row.sets = [];
        }
      }
      return row;
    });

    res.json(entries);
  });
});

// Get single workout entry
app.get('/api/entries/:id', (req, res) => {
  db.get(`
    SELECT * FROM workout_entries WHERE id = ?
  `, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    // Parse sets JSON for lift entries
    if (row.type === 'lift' && row.sets) {
      try {
        row.sets = JSON.parse(row.sets);
      } catch (e) {
        row.sets = [];
      }
    }

    res.json(row);
  });
});

// Create new workout entry
app.post('/api/entries', (req, res) => {
  const {
    type, date, session_name, notes,
    lift_name, sets, unit, rpe,
    modality, duration, distance, distance_unit, avg_hr,
    technique, rounds, round_length
  } = req.body;

  // Validation
  if (!type || !date) {
    res.status(400).json({ error: 'Type and date are required' });
    return;
  }

  // Stringify sets for lift entries
  const setsJson = sets ? JSON.stringify(sets) : null;

  db.run(`
    INSERT INTO workout_entries (
      type, date, session_name, notes,
      lift_name, sets, unit, rpe,
      modality, duration, distance, distance_unit, avg_hr,
      technique, rounds, round_length
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    type, date, session_name || null, notes || null,
    lift_name || null, setsJson, unit || null, rpe || null,
    modality || null, duration || null, distance || null, distance_unit || null, avg_hr || null,
    technique || null, rounds || null, round_length || null
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, message: 'Entry created successfully' });
  });
});

// Update workout entry
app.put('/api/entries/:id', (req, res) => {
  const {
    type, date, session_name, notes,
    lift_name, sets, unit, rpe,
    modality, duration, distance, distance_unit, avg_hr,
    technique, rounds, round_length
  } = req.body;

  const setsJson = sets ? JSON.stringify(sets) : null;

  db.run(`
    UPDATE workout_entries SET
      type = ?, date = ?, session_name = ?, notes = ?,
      lift_name = ?, sets = ?, unit = ?, rpe = ?,
      modality = ?, duration = ?, distance = ?, distance_unit = ?, avg_hr = ?,
      technique = ?, rounds = ?, round_length = ?
    WHERE id = ?
  `, [
    type, date, session_name || null, notes || null,
    lift_name || null, setsJson, unit || null, rpe || null,
    modality || null, duration || null, distance || null, distance_unit || null, avg_hr || null,
    technique || null, rounds || null, round_length || null,
    req.params.id
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }
    res.json({ message: 'Entry updated successfully' });
  });
});

// Delete workout entry
app.delete('/api/entries/:id', (req, res) => {
  db.run(`
    DELETE FROM workout_entries WHERE id = ?
  `, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }
    res.json({ message: 'Entry deleted successfully' });
  });
});

// Get workout statistics
app.get('/api/stats', (req, res) => {
  db.get(`
    SELECT
      COUNT(*) as total_workouts,
      COUNT(CASE WHEN type = 'lift' THEN 1 END) as lift_workouts,
      COUNT(CASE WHEN type = 'cardio' THEN 1 END) as cardio_workouts,
      COUNT(CASE WHEN type = 'bjj' THEN 1 END) as bjj_workouts
    FROM workout_entries
  `, [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Workout Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Workout Tracker API server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💪 Frontend should be served separately (e.g., open index.html in browser)`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  });
});
