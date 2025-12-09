#!/bin/bash
# ==============================================
# AWS Deployment Script for Portfolio FSX
# ==============================================

set -e

echo "🚀 Deploying Portfolio FSX to AWS..."

# Configuration
APP_DIR="/app/portfolio"
COMPOSE_FILE="docker-compose.yml"

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Pull latest Docker images
echo "🐳 Pulling Docker images..."
docker-compose pull

# Restart containers
echo "🔄 Restarting containers..."
docker-compose up -d --force-recreate

# Remove old images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Health check
echo "🏥 Running health check..."
sleep 5
if curl -sf http://localhost:3000/api/site/config > /dev/null; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker-compose logs --tail=50
    exit 1
fi

echo "🎉 Deployment complete!"
echo "📅 Deployed at: $(date)"
