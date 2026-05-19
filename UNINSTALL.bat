@echo off
echo =========================================
echo POLARITY: SYSTEM PURGE (UNINSTALL)
echo =========================================
echo.

echo [1/3] Removing node_modules...
if exist "node_modules" rmdir /s /q "node_modules"

echo [2/3] Removing Python cache...
if exist "daemon\__pycache__" rmdir /s /q "daemon\__pycache__"

echo [3/3] Clearing Expo bundler cache...
if exist ".expo" rmdir /s /q ".expo"

echo.
echo =========================================
echo Purge Complete. Development caches cleared.
echo =========================================
pause
