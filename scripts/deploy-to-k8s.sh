#!/bin/bash
set -e

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}
IMAGE_TAG=${IMAGE_TAG:-$(git rev-parse --short HEAD)}
INGRESS_HOST=${INGRESS_HOST:-"microfe-takeofs.example.com"}
NAMESPACE=${NAMESPACE:-"microfe-takeofs"}

# Check if namespace exists, create if it doesn't
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
  echo "Creating namespace: $NAMESPACE"
  kubectl create namespace "$NAMESPACE"
fi

# Replace variables in Kubernetes manifests
echo "Configuring Kubernetes manifests with:"
echo "  DOCKER_REGISTRY: $DOCKER_REGISTRY"
echo "  IMAGE_TAG: $IMAGE_TAG"
echo "  INGRESS_HOST: $INGRESS_HOST"

# Apply kustomization
cd k8s
kustomize edit set image ${DOCKER_REGISTRY}/microfe-takeofs=${DOCKER_REGISTRY}/microfe-takeofs:${IMAGE_TAG}
cd ..

# Apply the configuration
echo "Applying Kubernetes configuration..."
kubectl apply -k k8s/

echo "Deployment completed successfully!"
echo "Application should be available at: https://$INGRESS_HOST" 