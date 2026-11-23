@echo off
chcp 65001 >nul
title KARTO
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Download it from https://nodejs.org (version 22 or newer). & pause & exit /b)
if not exist server\node_modules (echo Installing... & call npm run setup)
if not exist web\dist (echo Building... & call npm run build)
start "" http://localhost:4000
call npm start
pause
