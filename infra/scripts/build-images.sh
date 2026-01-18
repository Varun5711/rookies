#!/bin/bash
# ============================================================================
# BharatSetu DPI Platform - Docker Image Build and Push Script
# ============================================================================
# This script builds and pushes all Docker images to the registry
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
DOCKERFILES_DIR="$PROJECT_ROOT/infra/dockerfiles"

# Docker Registry Configuration
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
GIT_SHA="${GIT_SHA:-$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')}"

# Services to build
SERVICES=(
    "api-gateway"
    "auth-svc"
    "healthcare-svc"
    "agriculture-svc"
    "urban-svc"
    "notification-svc"
    "audit-svc"
    "analytics-svc"
    "service-registry"
    "dpi-client"
)

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
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if [ -z "$DOCKER_REGISTRY" ]; then
        log_warning "DOCKER_REGISTRY is not set. Images will be built locally only."
    fi
    
    log_success "All prerequisites are met."
}

# Build a single service
build_service() {
    local service=$1
    local dockerfile="$DOCKERFILES_DIR/Dockerfile.$service"
    
    if [ ! -f "$dockerfile" ]; then
        log_error "Dockerfile not found: $dockerfile"
        return 1
    fi
    
    local image_name="${DOCKER_REGISTRY:+$DOCKER_REGISTRY/}bharatsetu/$service"
    
    log_info "Building $service..."
    
    cd "$PROJECT_ROOT"
    
    docker build \
        -f "$dockerfile" \
        -t "$image_name:$IMAGE_TAG" \
        -t "$image_name:$GIT_SHA" \
        -t "$image_name:latest" \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        --cache-from "$image_name:latest" \
        .
    
    log_success "Built $service"
}

# Build all services
build_all() {
    log_info "Building all services..."
    
    for service in "${SERVICES[@]}"; do
        build_service "$service"
    done
    
    log_success "All services built."
}

# Build services in parallel
build_parallel() {
    log_info "Building all services in parallel..."
    
    local pids=()
    
    for service in "${SERVICES[@]}"; do
        build_service "$service" &
        pids+=($!)
    done
    
    # Wait for all builds to complete
    for pid in "${pids[@]}"; do
        wait "$pid" || {
            log_error "Build failed for one or more services"
            exit 1
        }
    done
    
    log_success "All services built."
}

# Push a single service
push_service() {
    local service=$1
    
    if [ -z "$DOCKER_REGISTRY" ]; then
        log_error "DOCKER_REGISTRY is not set. Cannot push images."
        exit 1
    fi
    
    local image_name="$DOCKER_REGISTRY/bharatsetu/$service"
    
    log_info "Pushing $service..."
    
    docker push "$image_name:$IMAGE_TAG"
    docker push "$image_name:$GIT_SHA"
    docker push "$image_name:latest"
    
    log_success "Pushed $service"
}

# Push all services
push_all() {
    log_info "Pushing all services..."
    
    for service in "${SERVICES[@]}"; do
        push_service "$service"
    done
    
    log_success "All services pushed."
}

# Build and push
build_and_push() {
    build_all
    push_all
}

# Login to registry
login() {
    if [ -z "$DOCKER_REGISTRY" ]; then
        log_error "DOCKER_REGISTRY is not set."
        exit 1
    fi
    
    log_info "Logging into Docker registry..."
    
    # For AWS ECR
    if [[ "$DOCKER_REGISTRY" == *"amazonaws.com"* ]]; then
        aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin "$DOCKER_REGISTRY"
    else
        docker login "$DOCKER_REGISTRY"
    fi
    
    log_success "Logged in to registry."
}

# List images
list_images() {
    log_info "Built images:"
    
    docker images | grep bharatsetu
}

# Clean up local images
cleanup() {
    log_warning "This will remove all bharatsetu images!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker images | grep bharatsetu | awk '{print $3}' | xargs -r docker rmi -f
        log_success "Cleanup completed."
    else
        log_info "Cleanup cancelled."
    fi
}

# Print usage
print_usage() {
    echo "Usage: $0 <command> [service]"
    echo ""
    echo "Commands:"
    echo "  build [service]     Build a specific service or all services"
    echo "  build-parallel      Build all services in parallel"
    echo "  push [service]      Push a specific service or all services"
    echo "  build-push          Build and push all services"
    echo "  login               Login to Docker registry"
    echo "  list                List built images"
    echo "  cleanup             Remove all bharatsetu images"
    echo "  help                Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_REGISTRY     Docker registry URL (e.g., 123456789.dkr.ecr.ap-south-1.amazonaws.com)"
    echo "  IMAGE_TAG           Image tag (default: latest)"
    echo "  GIT_SHA             Git SHA for tagging (auto-detected)"
    echo ""
    echo "Available Services:"
    for service in "${SERVICES[@]}"; do
        echo "  - $service"
    done
}

# Main
main() {
    check_prerequisites
    
    case "${1:-help}" in
        build)
            if [ -n "${2:-}" ]; then
                build_service "$2"
            else
                build_all
            fi
            ;;
        build-parallel)
            build_parallel
            ;;
        push)
            if [ -n "${2:-}" ]; then
                push_service "$2"
            else
                push_all
            fi
            ;;
        build-push)
            build_and_push
            ;;
        login)
            login
            ;;
        list)
            list_images
            ;;
        cleanup)
            cleanup
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
