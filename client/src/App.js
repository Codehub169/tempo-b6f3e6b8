import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
// Global styles are typically imported in main.js or App.js
// If App.css contains styles specific to App component's layout, it's fine here too.
// For now, assuming App.css is global and imported in main.js.

/**
 * The main application component.
 * Sets up client-side routing for the application.
 */
function App() {
  return (
    <Router>
      {/* The .app-container class can be used for global layout styling */}
      <div className="app-container">
        <Routes>
          {/* Route for the home page / game selection */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route for displaying a specific game 
              ':gameId' will be a URL parameter to identify the game */}
          <Route path="/game/:gameId" element={<GamePage />} />
          
          {/* Future routes can be added here, e.g., for settings or profiles */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;