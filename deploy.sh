#!/bin/bash
set -e

echo "=== Pulling latest code ==="
cd ~/pp_backend
git pull origin main
npm install

echo "=== Restarting backend with PM2 ==="
pm2 stop backend || true
pm2 start index.js --name backend
pm2 save

echo "=== Deploying frontend ==="
cd ~/pp_frontend
git pull origin main
npm install
npm run build

echo "=== Restarting nginx ==="
sudo systemctl reload nginx

echo "✅ Deployment complete"
