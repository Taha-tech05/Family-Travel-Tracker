@echo off
REM Quick Start Script for Family Travel Tracker (React Version)

echo.
echo ========================================
echo Family Travel Tracker - Quick Start
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "index.js" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

echo Step 1: Installing backend dependencies...
call npm install cors
echo Backend dependencies installed
echo.

echo Step 2: Checking client dependencies...
cd client
if not exist "node_modules" (
    echo Installing client dependencies...
    call npm install
)
echo Client dependencies ready
cd ..
echo.

echo ========================================
echo Step 3: IMPORTANT - Copy SVG Map
echo ========================================
echo You need to copy the world map SVG paths:
echo.
echo Option 1 - Manual:
echo   1. Open: views\index.ejs
echo   2. Copy lines 33-385 (all ^<path^> elements)
echo   3. Open: client\src\WorldMap.jsx
echo   4. Paste inside the ^<svg^> tag
echo.
echo Option 2 - Script:
echo   cd client\src
echo   node extract_svg.js
echo   # Then copy from extracted_svg_paths.txt to WorldMap.jsx
echo.

echo ========================================
echo Step 4: Database Setup
echo ========================================
echo Make sure PostgreSQL is running and:
echo   1. Database 'world' exists
echo   2. Tables are created (run queries.sql)
echo   3. Update credentials in index.js if needed
echo.

echo ========================================
echo Step 5: Start the Application
echo ========================================
echo.
echo Open TWO command prompt windows:
echo.
echo Terminal 1 (Backend):
echo   node index.js
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.

echo ========================================
echo Setup complete! Follow the steps above.
echo ========================================
echo.
echo For more details, see:
echo   - README.md
echo   - CONVERSION_SUMMARY.md
echo.

pause
