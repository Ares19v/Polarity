@echo off
echo =========================================
echo BOOTING POLARITY MISSION CONTROL...
echo =========================================
echo.

echo 1. Booting Python Local Daemon (FastAPI)...
start "Polarity Daemon" cmd /k "uvicorn daemon.main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Booting Android Emulator (Pixel_7)...
start "" "C:\Users\Devansh Tyagi\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_7

echo 3. Waiting 15 seconds for systems to initialize...
timeout /t 15 /nobreak >nul

echo 4. Starting Expo Metro Server...
start "Polarity Metro Server" cmd /k "cd /d "C:\Users\Devansh Tyagi\Desktop\Projects\Polarity" && npm run android"

echo 5. Opening Web Preview...
start http://localhost:8081

echo.
echo =========================================
echo Workspace launched successfully!
echo Close this window to keep servers running in the background.
echo =========================================
timeout /t 5 >nul
