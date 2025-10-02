#!/bin/bash
# 🚀 Quick Deploy Script for Vercel

echo "🌍 NASA Space Challenge 2025 - Deployment Script"
echo "================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Test build first
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    echo ""
    echo "⚠️  IMPORTANT: Make sure you've added environment variables on Vercel:"
    echo "   - VITE_OPENWEATHER_API_KEY"
    echo "   - VITE_NASA_API_KEY"
    echo ""
    echo "Press Enter to continue or Ctrl+C to cancel..."
    read
    
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Check the deployment URL provided above"
    echo "   2. Verify all features work on the live site"
    echo "   3. If API keys not working, add them in Vercel dashboard"
    echo "   4. Share your live site URL!"
    echo ""
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
