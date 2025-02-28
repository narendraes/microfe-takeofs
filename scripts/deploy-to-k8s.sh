#!/bin/bash
set -e

# Configuration
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
DOMAIN_NAME=${DOMAIN_NAME:-"your-domain.com"}
NAMESPACE=${NAMESPACE:-"default"}

# Base64 encoded secrets
# In a real CI/CD pipeline, these would be securely stored and retrieved
BASE64_ENCODED_API_KEY=${BASE64_ENCODED_API_KEY:-""}

# Create temporary directory for processed manifests
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Process Kubernetes manifests
echo "Processing Kubernetes manifests..."

# Process each YAML file
for file in k8s/*.yaml; do
  basename=$(basename "$file")
  sed -e "s|\${DOCKER_REGISTRY}|$DOCKER_REGISTRY|g" \
      -e "s|\${IMAGE_TAG}|$IMAGE_TAG|g" \
      -e "s|\${DOMAIN_NAME}|$DOMAIN_NAME|g" \
      -e "s|\${BASE64_ENCODED_API_KEY}|$BASE64_ENCODED_API_KEY|g" \
      "$file" > "$TEMP_DIR/$basename"
done

# Apply ConfigMap and Secret first
if [ -f "$TEMP_DIR/configmap.yaml" ]; then
  echo "Applying ConfigMap..."
  kubectl apply -f "$TEMP_DIR/configmap.yaml" -n "$NAMESPACE"
fi

if [ -f "$TEMP_DIR/secret.yaml" ]; then
  echo "Applying Secret..."
  kubectl apply -f "$TEMP_DIR/secret.yaml" -n "$NAMESPACE"
fi

# Apply Deployment and Service
if [ -f "$TEMP_DIR/deployment.yaml" ]; then
  echo "Applying Deployment, Service, and Ingress..."
  kubectl apply -f "$TEMP_DIR/deployment.yaml" -n "$NAMESPACE"
fi

echo "Deployment completed successfully!"
echo "Application should be available at: https://$DOMAIN_NAME" 