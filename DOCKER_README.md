# Docker and Kubernetes Deployment Guide

This guide explains how to containerize the MicroFE TakeOfs application and deploy it to a Kubernetes cluster.

## Prerequisites

- Docker installed and configured
- Kubernetes cluster access configured (kubectl)
- Access to a Docker registry

## Docker Container

The application is containerized using a multi-stage Docker build process that:

1. Installs dependencies
2. Builds the Next.js application
3. Creates a minimal production image

### Building the Docker Image Manually

```bash
# Build the image
docker build -t your-registry.com/microfe-takeofs:latest .

# Run the container locally
docker run -p 3000:3000 your-registry.com/microfe-takeofs:latest

# Push to registry
docker push your-registry.com/microfe-takeofs:latest
```

### Using the Build Script

We provide a convenience script to build and push the Docker image:

```bash
# Set environment variables (optional)
export DOCKER_REGISTRY=your-registry.com
export IMAGE_NAME=microfe-takeofs
export IMAGE_TAG=v1.0.0

# Run the build script
./scripts/build-and-push.sh
```

## Kubernetes Deployment

The application can be deployed to a Kubernetes cluster using the provided manifests in the `k8s` directory.

### Kubernetes Resources

- **Deployment**: Manages the application pods
- **Service**: Exposes the application within the cluster
- **Ingress**: Provides external access to the application
- **Kustomization**: Manages all resources together

### Deploying to Kubernetes Manually

```bash
# Create namespace
kubectl create namespace microfe-takeofs

# Apply the Kubernetes manifests
kubectl apply -k k8s/
```

### Using the Deploy Script

We provide a convenience script to deploy to Kubernetes:

```bash
# Set environment variables (optional)
export DOCKER_REGISTRY=your-registry.com
export IMAGE_TAG=v1.0.0
export INGRESS_HOST=microfe-takeofs.example.com
export NAMESPACE=microfe-takeofs

# Run the deploy script
./scripts/deploy-to-k8s.sh
```

## Configuration

The application can be configured using environment variables:

- `NODE_ENV`: Set to "production" for production deployments
- `PORT`: The port the application listens on (default: 3000)

## Monitoring and Maintenance

The Kubernetes deployment includes:

- Resource limits and requests
- Readiness and liveness probes
- Multiple replicas for high availability

## Troubleshooting

If you encounter issues:

1. Check pod logs: `kubectl logs -n microfe-takeofs <pod-name>`
2. Check pod status: `kubectl describe pod -n microfe-takeofs <pod-name>`
3. Verify service: `kubectl get svc -n microfe-takeofs`
4. Check ingress: `kubectl get ingress -n microfe-takeofs` 