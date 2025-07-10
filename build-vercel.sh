
#!/bin/bash
set -e

echo "🏗️ Building for Vercel deployment..."

# Build frontend
echo "📦 Building frontend..."
cd client
npm install
npm run build
cd ..

# Create api directory structure
echo "🔧 Setting up API..."
mkdir -p api
cp server/*.js api/ 2>/dev/null || echo "No JS files to copy"

echo "✅ Build completed successfully!"
