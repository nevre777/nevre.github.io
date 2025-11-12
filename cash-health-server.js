const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get the user data directory based on platform
const getDataPath = () => {
  if (typeof process !== 'undefined' && process.env.PORTABLE_EXECUTABLE_DIR) {
    return process.env.PORTABLE_EXECUTABLE_DIR;
  }
  const electron = require('electron');
  const app = electron.app || electron.remote.app;
  return app.getPath('userData');
};

// Initialize SQLite database (persistent file)
let dbPath;
try {
  dbPath = path.join(getDataPath(), 'cash-health.db');
  console.log('Database path:', dbPath);
} catch (error) {
  // Fallback to current directory if electron is not available
  dbPath = path.join(__dirname, 'cash-health.db');
  console.log('Using fallback database path:', dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating settings table:', err);
    } else {
      console.log('Settings table initialized');
      // Insert default settings if they don't exist
      insertDefaultSettings();
    }
  });

  // Entries table
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_date TEXT NOT NULL,
      daily_sales REAL NOT NULL,
      taxes_percent REAL NOT NULL,
      royalty_percent REAL NOT NULL,
      rent_percent REAL NOT NULL,
      advertising_percent REAL NOT NULL,
      cogs_percent REAL NOT NULL,
      labor_percent REAL NOT NULL,
      rm_percent REAL NOT NULL,
      utilities_percent REAL NOT NULL,
      merchant_percent REAL NOT NULL,
      supplies_percent REAL NOT NULL,
      insurance_percent REAL NOT NULL,
      cash_balance REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating entries table:', err);
    } else {
      console.log('Entries table initialized');
    }
  });
}

// Insert default settings
function insertDefaultSettings() {
  const defaults = [
    ['weekly_target', '204213.29'],
    ['dark_mode', 'false']
  ];

  defaults.forEach(([key, value]) => {
    db.run(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      [key, value],
      (err) => {
        if (err) {
          console.error(`Error inserting default setting ${key}:`, err);
        }
      }
    );
  });
}

// API Routes

// Get all settings
app.get('/api/settings', (req, res) => {
  db.all('SELECT * FROM settings', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Convert array to object
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });

    res.json(settings);
  });
});

// Get single setting
app.get('/api/settings/:key', (req, res) => {
  db.get(
    'SELECT * FROM settings WHERE key = ?',
    [req.params.key],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Setting not found' });
        return;
      }
      res.json({ key: row.key, value: row.value });
    }
  );
});

// Update or create setting
app.put('/api/settings/:key', (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    res.status(400).json({ error: 'Value is required' });
    return;
  }

  db.run(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [req.params.key, String(value)],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        key: req.params.key,
        value: String(value),
        message: 'Setting updated successfully'
      });
    }
  );
});

// Get all entries (sorted by date, newest first)
app.get('/api/entries', (req, res) => {
  db.all(
    'SELECT * FROM entries ORDER BY entry_date DESC, created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get single entry
app.get('/api/entries/:id', (req, res) => {
  db.get(
    'SELECT * FROM entries WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }
      res.json(row);
    }
  );
});

// Create new entry
app.post('/api/entries', (req, res) => {
  const {
    entry_date,
    daily_sales,
    taxes_percent,
    royalty_percent,
    rent_percent,
    advertising_percent,
    cogs_percent,
    labor_percent,
    rm_percent,
    utilities_percent,
    merchant_percent,
    supplies_percent,
    insurance_percent,
    cash_balance
  } = req.body;

  // Validation
  if (!entry_date || daily_sales === undefined || cash_balance === undefined) {
    res.status(400).json({ error: 'entry_date, daily_sales, and cash_balance are required' });
    return;
  }

  db.run(
    `INSERT INTO entries (
      entry_date, daily_sales, taxes_percent, royalty_percent,
      rent_percent, advertising_percent, cogs_percent, labor_percent,
      rm_percent, utilities_percent, merchant_percent, supplies_percent,
      insurance_percent, cash_balance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry_date,
      daily_sales,
      taxes_percent || 0,
      royalty_percent || 0,
      rent_percent || 0,
      advertising_percent || 0,
      cogs_percent || 0,
      labor_percent || 0,
      rm_percent || 0,
      utilities_percent || 0,
      merchant_percent || 0,
      supplies_percent || 0,
      insurance_percent || 0,
      cash_balance
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Entry created successfully'
      });
    }
  );
});

// Update entry
app.put('/api/entries/:id', (req, res) => {
  const {
    entry_date,
    daily_sales,
    taxes_percent,
    royalty_percent,
    rent_percent,
    advertising_percent,
    cogs_percent,
    labor_percent,
    rm_percent,
    utilities_percent,
    merchant_percent,
    supplies_percent,
    insurance_percent,
    cash_balance
  } = req.body;

  db.run(
    `UPDATE entries SET
      entry_date = ?,
      daily_sales = ?,
      taxes_percent = ?,
      royalty_percent = ?,
      rent_percent = ?,
      advertising_percent = ?,
      cogs_percent = ?,
      labor_percent = ?,
      rm_percent = ?,
      utilities_percent = ?,
      merchant_percent = ?,
      supplies_percent = ?,
      insurance_percent = ?,
      cash_balance = ?
    WHERE id = ?`,
    [
      entry_date,
      daily_sales,
      taxes_percent || 0,
      royalty_percent || 0,
      rent_percent || 0,
      advertising_percent || 0,
      cogs_percent || 0,
      labor_percent || 0,
      rm_percent || 0,
      utilities_percent || 0,
      merchant_percent || 0,
      supplies_percent || 0,
      insurance_percent || 0,
      cash_balance,
      req.params.id
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }
      res.json({ message: 'Entry updated successfully' });
    }
  );
});

// Delete entry
app.delete('/api/entries/:id', (req, res) => {
  db.run(
    'DELETE FROM entries WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }
      res.json({ message: 'Entry deleted successfully' });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cash Health Tracker API is running',
    database: dbPath
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`💰 Cash Health Tracker API server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Database location: ${dbPath}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  });
});

// Export for use in Electron
module.exports = { app, server, db };
