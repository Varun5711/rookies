#!/bin/bash
# ============================================================================
# BharatSetu DPI Platform - Kubernetes Deployment Script
# ============================================================================
# This script deploys the platform to a Kubernetes cluster
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
K8S_DIR="$PROJECT_ROOT/infra/kubernetes"
NAMESPACE="bharatsetu"
MONITORING_NAMESPACE="monitoring"

# Docker Registry
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
        exit 1
    fi
    
    if [ -z "$DOCKER_REGISTRY" ]; then
        log_warning "DOCKER_REGISTRY is not set. Using default image names."
    fi
    
    log_success "All prerequisites are met."
}

# Create namespaces
create_namespaces() {
    log_info "Creating namespaces..."
    
    kubectl apply -f "$K8S_DIR/base/namespace.yaml"
    
    log_success "Namespaces created."
}

# Apply secrets and configmaps
apply_config() {
    log_info "Applying secrets and configmaps..."
    
    # Substitute environment variables in manifests
    export DOCKER_REGISTRY
    export IMAGE_TAG
    
    kubectl apply -f "$K8S_DIR/base/configmap.yaml"
    kubectl apply -f "$K8S_DIR/base/secrets.yaml"
    
    log_success "Configuration applied."
}

# Apply RBAC
apply_rbac() {
    log_info "Applying RBAC configuration..."
    
    kubectl apply -f "$K8S_DIR/base/rbac.yaml"
    
    log_success "RBAC applied."
}

# Deploy monitoring stack
deploy_monitoring() {
    log_info "Deploying monitoring stack..."
    
    kubectl apply -f "$K8S_DIR/monitoring/prometheus.yaml"
    kubectl apply -f "$K8S_DIR/monitoring/grafana.yaml"
    kubectl apply -f "$K8S_DIR/monitoring/alertmanager.yaml"
    
    log_info "Waiting for monitoring pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=prometheus -n $MONITORING_NAMESPACE --timeout=300s || true
    kubectl wait --for=condition=ready pod -l app=grafana -n $MONITORING_NAMESPACE --timeout=300s || true
    
    log_success "Monitoring stack deployed."
}

# Deploy application services
deploy_applications() {
    log_info "Deploying application services..."
    
    # Replace placeholders with actual values
    for file in $(find "$K8S_DIR/base" -name "*.yaml" | grep -v namespace | grep -v configmap | grep -v secrets | grep -v rbac); do
        log_info "Applying $file..."
        envsubst < "$file" | kubectl apply -f -
    done
    
    log_success "Application services deployed."
}

# Deploy ingress
deploy_ingress() {
    log_info "Deploying ingress configuration..."
    
    kubectl apply -f "$K8S_DIR/ingress/ingress.yaml"
    
    log_success "Ingress deployed."
}

# Wait for deployments
wait_for_deployments() {
    log_info "Waiting for all deployments to be ready..."
    
    kubectl wait --for=condition=available --all deployments -n $NAMESPACE --timeout=600s
    
    log_success "All deployments are ready."
}

# Show deployment status
show_status() {
    log_info "Deployment status:"
    
    echo ""
    echo "=== Pods ==="
    kubectl get pods -n $NAMESPACE
    
    echo ""
    echo "=== Services ==="
    kubectl get services -n $NAMESPACE
    
    echo ""
    echo "=== Ingress ==="
    kubectl get ingress -n $NAMESPACE
    
    echo ""
    echo "=== HPAs ==="
    kubectl get hpa -n $NAMESPACE
    
    echo ""
    echo "=== Monitoring Pods ==="
    kubectl get pods -n $MONITORING_NAMESPACE
}

# Rollback deployment
rollback() {
    local deployment=${1:-}
    
    if [ -z "$deployment" ]; then
        log_error "Please specify a deployment to rollback"
        exit 1
    fi
    
    log_info "Rolling back deployment: $deployment"
    kubectl rollout undo deployment/$deployment -n $NAMESPACE
    
    log_success "Rollback completed."
}

# Scale deployment
scale() {
    local deployment=${1:-}
    local replicas=${2:-}
    
    if [ -z "$deployment" ] || [ -z "$replicas" ]; then
        log_error "Usage: scale <deployment> <replicas>"
        exit 1
    fi
    
    log_info "Scaling $deployment to $replicas replicas..."
    kubectl scale deployment/$deployment --replicas=$replicas -n $NAMESPACE
    
    log_success "Scaling completed."
}

# Delete all resources
delete_all() {
    log_warning "This will delete all BharatSetu resources from the cluster!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deleting all resources..."
        
        kubectl delete -f "$K8S_DIR/ingress/" --ignore-not-found
        kubectl delete -f "$K8S_DIR/base/" --ignore-not-found
        kubectl delete -f "$K8S_DIR/monitoring/" --ignore-not-found
        kubectl delete namespace $NAMESPACE --ignore-not-found
        kubectl delete namespace $MONITORING_NAMESPACE --ignore-not-found
        
        log_success "All resources deleted."
    else
        log_info "Deletion cancelled."
    fi
}

# Deploy everything
deploy_all() {
    create_namespaces
    apply_rbac
    apply_config
    deploy_monitoring
    deploy_applications
    deploy_ingress
    wait_for_deployments
    show_status
}

# Print usage
print_usage() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  deploy              Deploy all components"
    echo "  deploy-monitoring   Deploy monitoring stack only"
    echo "  deploy-apps         Deploy application services only"
    echo "  deploy-ingress      Deploy ingress only"
    echo "  status              Show deployment status"
    echo "  rollback <deploy>   Rollback a deployment"
    echo "  scale <deploy> <n>  Scale a deployment"
    echo "  delete              Delete all resources"
    echo "  help                Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_REGISTRY     Docker registry URL"
    echo "  IMAGE_TAG           Image tag to deploy (default: latest)"
}

# Main
main() {
    check_prerequisites
    
    case "${1:-help}" in
        deploy)
            deploy_all
            ;;
        deploy-monitoring)
            create_namespaces
            deploy_monitoring
            ;;
        deploy-apps)
            create_namespaces
            apply_rbac
            apply_config
            deploy_applications
            wait_for_deployments
            ;;
        deploy-ingress)
            deploy_ingress
            ;;
        status)
            show_status
            ;;
        rollback)
            rollback "${2:-}"
            ;;
        scale)
            scale "${2:-}" "${3:-}"
            ;;
        delete)
            delete_all
            ;;
        help|--help|-h)
            print_usage
            ;;
        *)
            log_error "Unknown command: $1"
            print_usage
            exit 1
            ;;
    esac
}

main "$@"
