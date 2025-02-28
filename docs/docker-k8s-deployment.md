# Docker and Kubernetes Deployment Guide

This guide explains how to deploy the MicroFE TakeOfs application using Docker and Kubernetes.

## Prerequisites

- Docker installed locally
- Kubernetes cluster (e.g., GKE, EKS, AKS, or Minikube for local development)
- kubectl configured to connect to your cluster
- Container registry access (e.g., Docker Hub, GCR, ECR)

## Docker Image

### Building Locally

To build the Docker image locally:

```bash
# Build the image
docker build -t your-registry/microfe-takeofs:latest .

# Push to registry
docker push your-registry/microfe-takeofs:latest
```

Alternatively, use the provided script:

```bash
# Set your registry (optional)
export DOCKER_REGISTRY=your-registry

# Build and push
./scripts/build-and-push.sh
```

## Kubernetes Deployment

### Manual Deployment

1. Update the Kubernetes manifests in the `k8s/` directory:
   - Set the correct Docker registry in `deployment.yaml`
   - Configure the domain name in `deployment.yaml`
   - Set environment variables in `configmap.yaml`
   - Add secrets in `secret.yaml` (base64 encoded)

2. Deploy to Kubernetes:

```bash
# Apply ConfigMap and Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Apply Deployment, Service, and Ingress
kubectl apply -f k8s/deployment.yaml
```

Alternatively, use the provided script:

```bash
# Set required variables
export DOCKER_REGISTRY=your-registry
export DOMAIN_NAME=your-domain.com
export BASE64_ENCODED_API_KEY=$(echo -n "your-api-key" | base64)
export NAMESPACE=your-namespace

# Deploy
./scripts/deploy-to-k8s.sh
```

### Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow for CI/CD. To use it:

1. Add the following secrets to your GitHub repository:
   - `DOCKER_REGISTRY`: Your container registry URL
   - `DOCKER_USERNAME`: Username for the container registry
   - `DOCKER_PASSWORD`: Password for the container registry
   - `DOMAIN_NAME`: The domain name for the application
   - `KUBE_CONFIG`: Base64-encoded kubeconfig file
   - `KUBE_NAMESPACE`: Kubernetes namespace (optional, defaults to "default")
   - `PRODUCTION_API_KEY_BASE64`: Base64-encoded API key

2. Push to the main branch or manually trigger the workflow.

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to "production" for production deployments
- `PRODUCTION_API_URL`: URL for the production API
- `PRODUCTION_API_KEY`: API key for authentication

## Monitoring and Troubleshooting

### Check Deployment Status

```bash
kubectl get deployments -n your-namespace
kubectl get pods -n your-namespace
kubectl get services -n your-namespace
kubectl get ingress -n your-namespace
```

### View Logs

```bash
# Get pod name
kubectl get pods -n your-namespace

# View logs
kubectl logs pod/microfe-takeofs-pod-name -n your-namespace
```

### Debug Issues

```bash
# Describe pod for details
kubectl describe pod/microfe-takeofs-pod-name -n your-namespace

# Execute commands in the container
kubectl exec -it pod/microfe-takeofs-pod-name -n your-namespace -- /bin/sh
```

## Scaling

To scale the deployment:

```bash
kubectl scale deployment/microfe-takeofs --replicas=3 -n your-namespace
```

## Updating the Application

To update the application:

1. Build and push a new Docker image with a new tag
2. Update the image tag in the deployment:

```bash
kubectl set image deployment/microfe-takeofs microfe-takeofs=your-registry/microfe-takeofs:new-tag -n your-namespace
```

Or update the deployment YAML and reapply it:

```bash
kubectl apply -f k8s/deployment.yaml -n your-namespace
``` 