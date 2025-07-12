#!/bin/bash

# Step 1: Stop and remove existing container
echo "Stopping and removing existing container..."
docker rm -f book-container 2>/dev/null || echo "Container not found."
docker rm -f book-db 2>/dev/null || echo "DB container not found."

# Step 2: Remove existing image
echo "Removing existing image..."
docker rmi book-image 2>/dev/null || echo "Image not found."


# Step 3: Start the PostgreSQL container
echo "Starting PostgreSQL container 'book-db'..."
docker run -d \
  --name book-db \
  --network smart-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=book_db \
  -p 5452:5432 \
  postgres:15

# Step 4: Build a new image
echo "Building new Docker image 'book-image'..."
docker build -t book-image .

# Step 5: Run a new container from the image
echo "Running new container 'book-container'..."
docker run -d -p 3001:8082 --network smart-network --name book-container book-image

echo "Done."