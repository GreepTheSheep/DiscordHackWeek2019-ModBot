@echo off
if not exist "token.json" (
    echo Token file not found!
    echo Please create a file named token.json
    echo and type the following:
    echo.
    echo {"token": "YOUR_TOKEN"}
    echo.
    echo Please go to discordapp.com/developers to get your token.
    echo.
    pause
    exit
)
if not exist "package-lock.json" (
    echo Modules not installed.
    echo Installing, it will take a while...
    echo.
    npm install
    cls
    echo Starting now...
    echo.
    node bot.js
) else (
    echo Starting...
    echo.
    node bot.js
)
