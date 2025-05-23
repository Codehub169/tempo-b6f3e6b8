import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css'; // We'll create this CSS file for specific card styling

// GameCard component: Displays a single game card with title, icon, and description.
// Props:
// - game: An object containing game details (id, title, description, icon_url)
const GameCard = ({ game }) => {
  if (!game) {
    return null; // Don't render if no game data is provided
  }

  return (
    <Link to={`/game/${game.id}`} className="game-card-link">
      <div className="game-card">
        <div className="game-card-image-container">
          {/* Use the icon_url from the game data. Ensure alt text is descriptive. */}
          <img src={game.icon_url} alt={`${game.title} game icon`} className="game-card-icon" />
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{game.title}</h3>
          <p className="game-card-description">{game.description}</p>
        </div>
        <div className="game-card-play-button-container">
            <span className="game-card-play-button">Play Now ✨</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

// Create a corresponding GameCard.css file in the same directory
// client/src/components/GameCard.css:
/*
.game-card-link {
  text-decoration: none;
  color: inherit;
  display: block; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card {
  background-color: var(--color-white);
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; 
  transition: inherit;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.game-card-image-container {
  background-color: var(--color-gold); /* Gold accent */
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px; /* Fixed height for image container */
}

.game-card-icon {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}

.game-card-content {
  padding: 20px;
  flex-grow: 1; /* Allows content to fill available space */
  text-align: center;
}

.game-card-title {
  font-family: var(--font-headings);
  color: var(--color-tomato);
  font-size: 1.6em;
  margin-top: 0;
  margin-bottom: 10px;
}

.game-card-description {
  font-family: var(--font-primary);
  color: var(--color-steel-blue);
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 15px;
}

.game-card-play-button-container {
  padding: 0 20px 20px 20px;
  margin-top: auto; /* Pushes button to the bottom if card content is short */
}

.game-card-play-button {
  display: block;
  background-color: var(--color-lime-green);
  color: var(--color-white);
  font-family: var(--font-primary);
  font-weight: bold;
  text-align: center;
  padding: 12px 20px;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 1em;
}

.game-card-link:hover .game-card-play-button {
  background-color: #28a745; /* Darker lime green */
}
*/
