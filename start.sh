#!/bin/bash

set -e

# 1. Cleanup 
echo " Cleaning up old containers..."
docker-compose down -v --remove-orphans
docker system prune -af --volumes -f

# 2. Rebuild 
echo "Rebuilding Docker containers..."
docker-compose build --no-cache

# 3. Start stack 
echo "Starting Docker services..."
docker-compose up -d



