import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Import global styles

// Get the root element from HTML
const rootElement = document.getElementById('root');

// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the App component within StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);