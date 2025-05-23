#!/bin/bash

# Kids Game Dashboard Startup Script
# This script installs all dependencies and starts the backend and frontend servers.

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error.
# Cause a pipeline to return the exit status of the last command in the pipeline that returned a non-zero status.
set -e
set -u
set -o pipefail

# Initialize PIDs to ensure they are defined
BACKEND_PID=""
FRONTEND_PID=""

# Function to clean up background processes on exit
cleanup() {
    echo "
--- Cleaning up background processes ---"
    # Disable set -e temporarily for cleanup to attempt all kills
    set +e
    if [ -n "$FRONTEND_PID" ] && ps -p "$FRONTEND_PID" > /dev/null; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID"
        wait "$FRONTEND_PID" 2>/dev/null || true # Wait for it to actually stop, ignore errors
    fi
    if [ -n "$BACKEND_PID" ] && ps -p "$BACKEND_PID" > /dev/null; then
        echo "Stopping backend server (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID"
        wait "$BACKEND_PID" 2>/dev/null || true # Wait for it to actually stop, ignore errors
    fi
    set -e # Re-enable set -e
    echo "Cleanup complete."
}

# Trap EXIT, INT, TERM signals to run the cleanup function
trap cleanup EXIT INT TERM

echo "--- Kids Game Dashboard Startup --- "

# Install all dependencies (root, server, client)
# This relies on the postinstall script in the root package.json
echo "
--- Installing all dependencies (root, server, client) ---"
npm install

# Verify installations
echo "
--- Verifying installations ---"
if [ ! -d "server/node_modules" ]; then
  echo "Error: 'server/node_modules' directory not found after installation. Please check npm install logs."
  exit 1
else
  echo "Server dependencies appear to be installed."
fi

if [ ! -d "client/node_modules" ]; then
  echo "Error: 'client/node_modules' directory not found after installation. Please check npm install logs."
  exit 1
else
  echo "Client dependencies appear to be installed."
fi

# --- Starting Backend Server ---
echo "
--- Starting Backend Server ---"
if [ -f "server/index.js" ]; then
  # Start in background, redirect stdout/stderr to logs in project root
  (cd "server" && npm start > ../server.log 2>&1 &)
  BACKEND_PID=$!
  echo "Backend server process starting with PID $BACKEND_PID. Logs: server.log"
  sleep 3 # Give the server a moment to initialize
  if ! ps -p "$BACKEND_PID" > /dev/null; then
    echo "Error: Backend server (PID $BACKEND_PID) failed to stay running."
    echo "Check server logs (server.log) for errors."
    # Not exiting here to allow frontend startup attempt, as per original logic
  else
    echo "Backend server process appears to be running (PID $BACKEND_PID)."
  fi
else 
  echo "Error: 'server/index.js' not found. Cannot start backend server."
  exit 1
fi

# --- Starting Frontend Server on Port 9000 ---
echo "
--- Starting Frontend Server on Port 9000 ---"
if [ -f "client/vite.config.js" ]; then # Check for a vite config as a proxy for client readiness
  # Start in background, redirect stdout/stderr to logs in project root
  (cd "client" && npm run dev -- --port 9000 > ../client.log 2>&1 &) 
  FRONTEND_PID=$!
  echo "Frontend server process starting with PID $FRONTEND_PID. Logs: client.log"
  sleep 5 # Give Vite a bit more time to initialize
  if ! ps -p "$FRONTEND_PID" > /dev/null; then
    echo "Error: Frontend server (PID $FRONTEND_PID) failed to stay running."
    echo "This is a likely cause for ERR_CONNECTION_REFUSED on http://localhost:9000."
    echo "Check client logs (client.log) for errors."
    exit 1
  else
    echo "Frontend server process appears to be running (PID $FRONTEND_PID)."
  fi
else
  echo "Error: 'client/vite.config.js' not found. Cannot start frontend server."
  exit 1
fi

echo "
--- Application Status ---"
if [ -n "$BACKEND_PID" ] && ps -p "$BACKEND_PID" > /dev/null; then
  echo "Backend server (Node.js/Express) is running (PID: $BACKEND_PID). Expected port: 3001 (or as configured in server/index.js)"
else
  echo "Backend server FAILED to start or stay running. Check server.log."
fi

if [ -n "$FRONTEND_PID" ] && ps -p "$FRONTEND_PID" > /dev/null; then
  echo "Frontend server (React/Vite) is running on port 9000 (PID: $FRONTEND_PID)."
  echo "Access the application at: http://localhost:9000"
else
  echo "Frontend server FAILED to start or stay running. Check client.log."
fi

echo "
To stop the application, press Ctrl+C in this terminal."
echo "Logs are being saved to server.log and client.log in the project root."

# Disable job control messages like "[1]+ Terminated ..."
set +m

# Wait for processes to exit. The trap will handle cleanup if script is interrupted.
# If a process died before this point, its PID might be empty or invalid.
# Only wait for PIDs that were successfully launched and might still be running.

RUNNING_PIDS=()
if [ -n "$FRONTEND_PID" ] && ps -p "$FRONTEND_PID" > /dev/null; then
  RUNNING_PIDS+=("$FRONTEND_PID")
fi
if [ -n "$BACKEND_PID" ] && ps -p "$BACKEND_PID" > /dev/null; then
  RUNNING_PIDS+=("$BACKEND_PID")
fi

if [ ${#RUNNING_PIDS[@]} -gt 0 ]; then
  # shellcheck disable=SC2086 # We want word splitting for PIDs to wait
  wait ${RUNNING_PIDS[@]} || true # Allow wait to 'fail' if processes are killed by trap or die
fi

echo "
--- Kids Game Dashboard Shutdown --- "
# Exit 0 to indicate normal shutdown, trap EXIT will have run cleanup.
exit 0
