#!/bin/sh
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Install Node.js 22+ from https://nodejs.org"; exit 1; }
[ -d server/node_modules ] || npm run setup
[ -d web/dist ] || npm run build
npm start
