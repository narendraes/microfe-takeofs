#!/bin/bash
set -e

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}
IMAGE_NAME=${IMAGE_NAME:-"microfe-takeofs"}
IMAGE_TAG=${IMAGE_TAG:-$(git rev-parse --short HEAD)}

# Full image name
FULL_IMAGE_NAME="$DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

# Build the Docker image
echo "Building Docker image: $FULL_IMAGE_NAME"
docker build -t "$FULL_IMAGE_NAME" .

# Push the Docker image
echo "Pushing Docker image: $FULL_IMAGE_NAME"
docker push "$FULL_IMAGE_NAME"

# Tag as latest
LATEST_IMAGE_NAME="$DOCKER_REGISTRY/$IMAGE_NAME:latest"
echo "Tagging as latest: $LATEST_IMAGE_NAME"
docker tag "$FULL_IMAGE_NAME" "$LATEST_IMAGE_NAME"
docker push "$LATEST_IMAGE_NAME"

echo "Image built and pushed successfully: $FULL_IMAGE_NAME and $LATEST_IMAGE_NAME" 