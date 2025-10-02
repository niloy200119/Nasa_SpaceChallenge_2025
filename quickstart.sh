#!/bin/bash

# 🚀 NASA Space Challenge - Quick Start Script

echo "🌍 NASA Space Challenge - Quick Start"
echo "====================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OpenWeatherMap API key!"
    echo "   Get one here: https://openweathermap.org/api (FREE)"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

# Check if API key is set
if grep -q "your_openweather_api_key_here" .env; then
    echo "⚠️  OpenWeatherMap API key not set in .env!"
    echo ""
    echo "📋 To get your FREE API key:"
    echo "   1. Go to https://openweathermap.org/api"
    echo "   2. Click 'Sign Up'"
    echo "   3. Copy your API key"
    echo "   4. Edit .env and replace 'your_openweather_api_key_here'"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

echo "✅ .env file found with API key!"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
echo "📍 App will open at: http://localhost:5173"
echo ""
echo "🎯 Try these features:"
echo "   • Search for 'Dhaka' or 'Tokyo'"
echo "   • Zoom to level 10+ to see real-time weather"
echo "   • Toggle weather layers (precipitation, temperature, etc.)"
echo "   • Click the weather marker for detailed info"
echo "   • Zoom to 11+ to see wind direction arrows"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
