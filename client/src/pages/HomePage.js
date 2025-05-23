import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import './HomePage.css'; // We'll create this CSS file for specific page styling

// HomePage component: Fetches and displays a list of available games.
const HomePage = () => {
  // State for storing the list of games
  const [games, setGames] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // API base URL (backend server)
  const API_BASE_URL = 'http://localhost:3001/api';

  // useEffect hook to fetch games when the component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/games`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err.message);
        setGames([]); // Clear games on error
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []); // Empty dependency array ensures this runs once on mount

  // Render loading state
  if (loading) {
    return <div className="home-page-status"><p>Loading awesome games... 🎮</p></div>;
  }

  // Render error state
  if (error) {
    return <div className="home-page-status home-page-error"><p>Oops! Couldn't load games: {error} 😭</p></div>;
  }

  // Render no games found state
  if (games.length === 0) {
    return <div className="home-page-status"><p>No games available right now. Check back soon! ✨</p></div>;
  }

  // Render the list of games
  return (
    <div className="home-page">
      <header className="home-page-header">
        <h1>Choose Your Adventure!</h1>
        <p>Pick a game below and let the fun begin!</p>
      </header>
      <div className="game-list">
        {/* Map through the games array and render a GameCard for each game */}
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
       <footer className="home-page-footer">
        <p>More fun games coming soon! 🚀</p>
      </footer>
    </div>
  );
};

export default HomePage;

// Create a corresponding HomePage.css file in the same directory
// client/src/pages/HomePage.css:
/*
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.home-page-header {
  text-align: center;
  margin-bottom: 40px;
}

.home-page-header h1 {
  font-family: var(--font-headings);
  color: var(--color-tomato);
  font-size: 3em;
  margin-bottom: 10px;
}

.home-page-header p {
  font-family: var(--font-primary);
  color: var(--color-steel-blue);
  font-size: 1.2em;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  justify-content: center;
}

.home-page-status {
  text-align: center;
  font-family: var(--font-primary);
  font-size: 1.5em;
  color: var(--color-steel-blue);
  padding: 50px 20px;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-page-error p {
 color: var(--color-tomato);
}

.home-page-footer {
  text-align: center;
  margin-top: 50px;
  padding: 20px;
  font-family: var(--font-primary);
  color: var(--color-steel-blue);
  font-size: 1em;
  border-top: 1px solid #eee;
}
*/
