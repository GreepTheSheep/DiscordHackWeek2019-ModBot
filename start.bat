@echo off
if not exist "package-lock.json" (
    npm install
    cls
    echo Starting now...
    echo.
    node bot.js
) else (
    echo The bot is installed, starting...
    echo.
    node bot.js
)
