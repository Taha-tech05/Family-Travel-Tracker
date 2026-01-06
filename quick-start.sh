#!/bin/bash

# Quick Start Script for Family Travel Tracker (React Version)
# This script helps you get started quickly

echo "🚀 Family Travel Tracker - Quick Start"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "index.js" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
npm install cors
echo "✅ Backend dependencies installed"
echo ""

echo "📦 Step 2: Checking client dependencies..."
cd client
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
fi
echo "✅ Client dependencies ready"
cd ..
echo ""

echo "📝 Step 3: Important - Copy SVG Map"
echo "======================================"
echo "You need to copy the world map SVG paths:"
echo ""
echo "Option 1 - Manual:"
echo "  1. Open: views/index.ejs"
echo "  2. Copy lines 33-385 (all <path> elements)"
echo "  3. Open: client/src/WorldMap.jsx"
echo "  4. Paste inside the <svg> tag"
echo ""
echo "Option 2 - Script:"
echo "  cd client/src"
echo "  node extract_svg.js"
echo "  # Then copy from extracted_svg_paths.txt to WorldMap.jsx"
echo ""

echo "🗄️  Step 4: Database Setup"
echo "======================================"
echo "Make sure PostgreSQL is running and:"
echo "  1. Database 'world' exists"
echo "  2. Tables are created (run queries.sql)"
echo "  3. Update credentials in index.js if needed"
echo ""

echo "🎯 Step 5: Start the Application"
echo "======================================"
echo ""
echo "Open TWO terminal windows:"
echo ""
echo "Terminal 1 (Backend):"
echo "  node index.js"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""

echo "✨ Setup complete! Follow the steps above to start the app."
echo ""
echo "📚 For more details, see:"
echo "  - README.md"
echo "  - CONVERSION_SUMMARY.md"
