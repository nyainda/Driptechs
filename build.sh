#!/bin/bash

echo "🏗️  Building DripTech for Vercel..."

# Build the client
echo "📦 Building client..."
cd client
npm install
npm run build
cd ..

# Copy client build to root for Vercel
echo "📁 Copying client build to root..."
rm -rf dist
mkdir -p dist
cp -r client/dist/* dist/

echo "✅ Build complete!"