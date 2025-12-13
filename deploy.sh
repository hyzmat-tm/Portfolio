#!/bin/bash

# Deploy script for Portfolio

echo "🚀 Starting deployment..."

# Variables
SERVER="alwyzon@portfolio.hyzmat-tm.com"
REMOTE_PATH="/var/www/Portfolio"

# 1. Upload frontend files
echo "📦 Uploading frontend files..."
rsync -avz --delete dist/ ${SERVER}:${REMOTE_PATH}/dist/

# 2. Upload server files
echo "📦 Uploading server files..."
rsync -avz --exclude 'node_modules' --exclude '.env' server/ ${SERVER}:${REMOTE_PATH}/server/

# 3. Restart backend on server
echo "🔄 Restarting backend..."
ssh ${SERVER} << 'ENDSSH'
cd /var/www/Portfolio/server
npm install --production
pm2 restart portfolio-api
pm2 save
ENDSSH

echo "✅ Deployment completed!"
echo "🌐 Frontend: https://portfolio.hyzmat-tm.com"
echo "🔧 Backend API: https://portfolio.hyzmat-tm.com/api/projects"
