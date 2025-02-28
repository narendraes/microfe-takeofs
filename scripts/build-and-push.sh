#!/bin/bash
set -e

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry"}
IMAGE_NAME="microfe-takeofs"
IMAGE_TAG=${IMAGE_TAG:-"latest"}

# Full image name
FULL_IMAGE_NAME="$DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

# Build the Docker image
echo "Building Docker image: $FULL_IMAGE_NAME"
docker build -t "$FULL_IMAGE_NAME" .

# Push the Docker image to the registry
echo "Pushing Docker image to registry: $FULL_IMAGE_NAME"
docker push "$FULL_IMAGE_NAME"

echo "Image built and pushed successfully: $FULL_IMAGE_NAME" 