import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import './GamePage.css'; // We'll create this CSS file for specific page styling

// Dynamically import game components using React.lazy
// This mapping assumes game_component_path from DB matches the key here.
const gameComponentRegistry = {
  'NumberGuess/NumberGuessGame.js': lazy(() => import('../games/NumberGuess/NumberGuessGame')),
  // Add other games here as they are created, e.g.:
  // 'MemoryMatch/MemoryMatchGame.js': lazy(() => import('../games/MemoryMatch/MemoryMatchGame')),
};

// GamePage component: Loads and displays the selected game.
const GamePage = () => {
  const { gameId } = useParams(); // Get gameId from URL parameters
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        // Fetch all games and find the one matching gameId.
        // Alternatively, if an endpoint /api/games/:id exists, use that.
        const response = await fetch(`${API_BASE_URL}/games`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const games = await response.json();
        // The gameId from params is a string, ensure comparison is correct (DB ID is usually number)
        const selectedGame = games.find(g => g.id.toString() === gameId);

        if (selectedGame) {
          setGameDetails(selectedGame);
        } else {
          setError('Game not found.');
        }
        // setError(null); // This was incorrect, should be set only if game found
      } catch (err) {
        console.error(`Failed to fetch game details for ID ${gameId}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (loading) {
    return <div className="game-page-status"><p>Loading your game... 🚀</p></div>;
  }

  if (error) {
    return (
      <div className="game-page-status game-page-error">
        <p>Oops! Could not load game: {error} 😢</p>
        <Link to="/" className="back-link">Back to Games</Link>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div className="game-page-status">
        <p>Game details not available. It might have been removed.</p>
        <Link to="/" className="back-link">Back to Games</Link>
      </div>
    );
  }

  // Determine which game component to render based on game_component_path
  const GameComponent = gameComponentRegistry[gameDetails.game_component_path];

  if (!GameComponent) {
    return (
      <div className="game-page-status game-page-error">
        <p>This game is currently not available or configured incorrectly. 🛠️</p>
        <Link to="/" className="back-link">Back to Games</Link>
      </div>
    );
  }

  return (
    <div className="game-page">
      <header className="game-page-header">
        <Link to="/" className="back-link">
          {/* Using a simple arrow, ideally an icon component */}
          <span role="img" aria-label="Back arrow">←</span> Back to All Games
        </Link>
        <h1>{gameDetails.title}</h1>
      </header>
      <main className="game-content-area">
        <Suspense fallback={<div className="game-page-status"><p>Starting game engine...⚙️</p></div>}>
          <GameComponent />
        </Suspense>
      </main>
    </div>
  );
};

export default GamePage;

// Create a corresponding GamePage.css file in the same directory
// client/src/pages/GamePage.css:
/*
.game-page {
  padding: 20px;
  max-width: 1000px; /* Game might need more width */
  margin: 0 auto;
}

.game-page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative; /* For absolute positioning of back link if needed */
}

.game-page-header h1 {
  font-family: var(--font-headings);
  color: var(--color-tomato);
  font-size: 2.8em;
  margin-top: 10px; /* Space from back link */
  margin-bottom: 0;
  text-align: center;
}

.back-link {
  display: inline-flex; /* For aligning icon and text */
  align-items: center;
  gap: 8px; /* Space between icon and text */
  font-family: var(--font-primary);
  color: var(--color-steel-blue);
  text-decoration: none;
  font-size: 1.1em;
  padding: 8px 15px;
  border-radius: 20px;
  background-color: #f0f0f0;
  transition: background-color 0.2s ease, color 0.2s ease;
  align-self: flex-start; /* Positions link to the left */
}

.back-link:hover {
  background-color: var(--color-gold);
  color: var(--color-black);
}

.back-link span {
  font-size: 1.5em; /* Makes arrow larger */
  line-height: 1; /* Better vertical alignment */
}

.game-content-area {
  background-color: var(--color-background-light, #f9f9f9); /* Fallback if var not defined */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.game-page-status {
  text-align: center;
  font-family: var(--font-primary);
  font-size: 1.5em;
  color: var(--color-steel-blue);
  padding: 50px 20px;
  min-height: 300px;
  display: flex;
  flex-direction: column; /* Stack message and link */
  justify-content: center;
  align-items: center;
  gap: 20px; /* Space between message and link */
}

.game-page-error p {
 color: var(--color-tomato);
}

*/
