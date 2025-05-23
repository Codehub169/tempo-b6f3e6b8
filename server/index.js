// server/index.js

// Import required modules
const express = require('express');
const cors = require('cors');
// const sqlite3 = require('sqlite3').verbose(); // Will be used with database.js later

// Initialize Express app
const app = express();

// Define the port for the server to listen on
// Use environment variable if available, otherwise default to 3001
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS for all routes and origins
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// --- Database Initialization (placeholder) ---
// const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//   if (err) {
//     console.error('Error opening database', err.message);
//   } else {
//     console.log('Connected to the SQLite database.');
//     // db.run('CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, iconUrl TEXT)');
//   }
// });

// --- API Routes ---

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy and running' });
});

// Placeholder route for fetching games
// This will be expanded upon when database.js is implemented
app.get('/api/games', (req, res) => {
  // For now, returns an empty array. Later, this will fetch from the SQLite database.
  res.json([]); 
});

// --- Global Error Handler (Basic) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API health check available at http://localhost:${PORT}/api/health`);
});
