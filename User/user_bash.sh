#!/bin/bash

# Step 1: Stop and remove existing container
echo "Stopping and removing existing container..."
docker rm -f user-container 2>/dev/null || echo "Container not found."
docker rm -f user-db 2>/dev/null || echo "DB container not found."

# Step 2: Remove existing image
echo "Removing existing image..."
docker rmi user-image 2>/dev/null || echo "Image not found."


# Step 3: Start the PostgreSQL container
echo "Starting PostgreSQL container 'user-db'..."
docker run -d \
  --name user-db \
  --network smart-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=user_db \
  -p 5451:5432 \
  postgres:15

# Step 4: Build a new image
echo "Building new Docker image 'user-image'..."
docker build -t user-image .

# Step 5: Run a new container from the image
echo "Running new container 'user-container'..."
docker run -d -p 3000:8081 --network smart-network --name user-container user-image

echo "Done."