const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file. It will be created in the 'server' directory.
const DB_PATH = path.join(__dirname, 'kids_games.sqlite');

// Initialize the database connection.
// The database is created if it doesn't exist.
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the games table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon_url TEXT, 
      game_component_path TEXT NOT NULL UNIQUE
    )`, (err) => {
      if (err) {
        console.error('Error creating games table', err.message);
      } else {
        // Seed initial game data if the table is empty or newly created
        seedInitialData();
      }
    });
  }
});

// Function to seed initial game data
function seedInitialData() {
  const games = [
    {
      title: 'Number Guessing Game',
      description: 'Guess the secret number between 1 and 100!',
      icon_url: '/assets/game_icon.png', // Path relative to client/public directory
      game_component_path: 'NumberGuess/NumberGuessGame.js'
    },
    // Add more games here in the future
    // {
    //   title: 'Shape Sorter',
    //   description: 'Drag and drop shapes into the correct slots.',
    //   icon_url: '/assets/shape_sorter_icon.png',
    //   game_component_path: 'ShapeSorter/ShapeSorterGame.js'
    // }
  ];

  const insertSql = `INSERT OR IGNORE INTO games (title, description, icon_url, game_component_path) VALUES (?, ?, ?, ?)`;

  games.forEach(game => {
    db.run(insertSql, [game.title, game.description, game.icon_url, game.game_component_path], function(err) {
      if (err) {
        console.error('Error inserting game:', game.title, err.message);
      } else if (this.changes > 0) {
        console.log(`Inserted game: ${game.title}`);
      }
    });
  });
}

// Function to get all games from the database
const getAllGames = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM games', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  getAllGames
};