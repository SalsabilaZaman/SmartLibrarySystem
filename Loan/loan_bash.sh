#!/bin/bash

# Step 1: Stop and remove existing container
echo "Stopping and removing existing container..."
docker rm -f loan-container 2>/dev/null || echo "Container not found."
docker rm -f loan-db 2>/dev/null || echo "DB container not found."

# Step 2: Remove existing image
echo "Removing existing image..."
docker rmi loan-image 2>/dev/null || echo "Image not found."


# Step 3: Start the PostgreSQL container
echo "Starting PostgreSQL container 'loan-db'..."
docker run -d \
  --name loan-db \
  --network smart-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=loan_db \
  -p 5453:5432 \
  postgres:15

# Step 4: Build a new image
echo "Building new Docker image 'loan-image'..."
docker build -t loan-image .

# Step 5: Run a new container from the image
echo "Running new container 'loan-container'..."
docker run -d -p 3002:8083 --network smart-network --name loan-container loan-image

echo "Done."