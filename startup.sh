#!/bin/bash

# Kids Game Dashboard Startup Script
# This script installs all dependencies and starts the backend and frontend servers.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Kids Game Dashboard Startup --- "

# Navigate to the project root directory (assuming the script is run from the root)
PROJECT_ROOT=$(pwd)

# Install root dependencies (like npm-run-all)
echo "
--- Installing root dependencies ---"
npm install

echo "
--- Installing server dependencies ---"
if [ -d "server" ]; then
  cd "server"
  npm install
  cd "$PROJECT_ROOT"
else
  echo "Error: 'server' directory not found."
  exit 1
fi

echo "
--- Installing client dependencies ---"
if [ -d "client" ]; then
  cd "client"
  npm install
  cd "$PROJECT_ROOT"
else
  echo "Error: 'client' directory not found."
  exit 1
fi

# Ensure execute permissions for this script if needed by user context
# chmod +x startup.sh

# --- Starting Backend Server ---
echo "
--- Starting Backend Server ---"
if [ -f "server/index.js" ]; then
  (cd "server" && npm start &)
  BACKEND_PID=$!
  echo "Backend server process started with PID $BACKEND_PID."
  # Give the server a moment to initialize
  sleep 3
else 
  echo "Error: 'server/index.js' not found. Cannot start backend server."
  exit 1
fi

# --- Starting Frontend Server on Port 9000 ---
echo "
--- Starting Frontend Server on Port 9000 ---"
if [ -f "client/vite.config.js" ]; then # Check for a vite config as a proxy for client readiness
  # The client's package.json dev script should be `vite`
  # We append `-- --port 9000` to pass the port argument to vite CLI
  (cd "client" && npm run dev -- --port 9000 &) 
  FRONTEND_PID=$!
  echo "Frontend server process started with PID $FRONTEND_PID."
else
  echo "Error: 'client/vite.config.js' not found. Cannot start frontend server."
  exit 1
fi

echo "
--- Application Status ---"
echo "Backend server (Node.js/Express) should be running (PID: $BACKEND_PID). Expected port: 3001 (or as configured in server/index.js)"
echo "Frontend server (React/Vite) should be running on port 9000 (PID: $FRONTEND_PID)."
echo "Access the application at: http://localhost:9000"

echo "
To stop the application, press Ctrl+C in this terminal."
echo "If processes do not stop, you may need to manually kill them using their PIDs: kill $BACKEND_PID $FRONTEND_PID"

# Wait for the frontend process to exit. If it's killed, this script will then exit.
# If backend is killed first, frontend might still be running. Waiting on both is better.
wait $FRONTEND_PID
wait $BACKEND_PID

echo "
--- Kids Game Dashboard Shutdown --- "
