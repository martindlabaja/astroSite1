#!/usr/bin/env bash
# Start the Astro dev server locally.
set -e

cd "$(dirname "$0")"

# Install dependencies on first run (or after they change).
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting dev server..."
npm run dev
