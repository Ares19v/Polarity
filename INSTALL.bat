@echo off
echo =========================================
echo POLARITY: DEPENDENCY INSTALLATION
echo =========================================
echo.

echo [1/2] Installing Node.js dependencies for Expo Frontend...
call npm install

echo.
echo [2/2] Installing Python dependencies for FastAPI Daemon...
call pip install -r requirements.txt

echo.
echo =========================================
echo Installation Complete! 
echo Run Run_Project.bat to launch Mission Control.
echo =========================================
pause
