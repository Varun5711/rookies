#!/bin/bash
# ============================================================================
# BharatSetu DPI Platform - Docker Deployment Script
# ============================================================================
# This script builds and deploys all services using Docker Compose
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
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$PROJECT_ROOT/infra"

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
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "All prerequisites are met."
}

# Load environment variables
load_env() {
    log_info "Loading environment variables..."
    
    if [ -f "$PROJECT_ROOT/.env" ]; then
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
        log_success "Environment variables loaded from .env"
    else
        log_warning "No .env file found. Using default values."
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env" 2>/dev/null || true
    fi
}

# Build all services
build_services() {
    log_info "Building all services..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose build --parallel
    else
        docker-compose build --parallel
    fi
    
    log_success "All services built successfully."
}

# Start infrastructure services
start_infrastructure() {
    log_info "Starting infrastructure services (PostgreSQL, Redis, Kafka, ClickHouse)..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose up -d postgres redis zookeeper kafka clickhouse
    else
        docker-compose up -d postgres redis zookeeper kafka clickhouse
    fi
    
    log_info "Waiting for infrastructure services to be healthy..."
    sleep 30
    
    log_success "Infrastructure services started."
}

# Start monitoring stack
start_monitoring() {
    log_info "Starting monitoring stack (Prometheus, Grafana, AlertManager)..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose up -d prometheus grafana alertmanager node-exporter cadvisor
    else
        docker-compose up -d prometheus grafana alertmanager node-exporter cadvisor
    fi
    
    log_success "Monitoring stack started."
}

# Start application services
start_applications() {
    log_info "Starting application services..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose up -d service-registry auth-svc healthcare-svc agriculture-svc urban-svc notification-svc audit-svc analytics-svc api-gateway dpi-client
    else
        docker-compose up -d service-registry auth-svc healthcare-svc agriculture-svc urban-svc notification-svc audit-svc analytics-svc api-gateway dpi-client
    fi
    
    log_success "Application services started."
}

# Start all services
start_all() {
    log_info "Starting all services..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose up -d
    else
        docker-compose up -d
    fi
    
    log_success "All services started."
}

# Stop all services
stop_all() {
    log_info "Stopping all services..."
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi
    
    log_success "All services stopped."
}

# Show service status
show_status() {
    log_info "Service status:"
    
    cd "$INFRA_DIR"
    
    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi
}

# Show logs
show_logs() {
    local service=${1:-}
    
    cd "$INFRA_DIR"
    
    if [ -z "$service" ]; then
        if docker compose version &> /dev/null; then
            docker compose logs -f --tail=100
        else
            docker-compose logs -f --tail=100
        fi
    else
        if docker compose version &> /dev/null; then
            docker compose logs -f --tail=100 "$service"
        else
            docker-compose logs -f --tail=100 "$service"
        fi
    fi
}

# Clean up
cleanup() {
    log_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$INFRA_DIR"
        
        if docker compose version &> /dev/null; then
            docker compose down -v --rmi all
        else
            docker-compose down -v --rmi all
        fi
        
        log_success "Cleanup completed."
    else
        log_info "Cleanup cancelled."
    fi
}

# Print usage
print_usage() {
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  build           Build all Docker images"
    echo "  start           Start all services"
    echo "  start-infra     Start infrastructure services only"
    echo "  start-monitor   Start monitoring stack only"
    echo "  start-apps      Start application services only"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  status          Show service status"
    echo "  logs [service]  Show logs (optionally for specific service)"
    echo "  cleanup         Remove all containers, volumes, and images"
    echo "  help            Show this help message"
}

# Main
main() {
    check_prerequisites
    load_env
    
    case "${1:-help}" in
        build)
            build_services
            ;;
        start)
            start_all
            ;;
        start-infra)
            start_infrastructure
            ;;
        start-monitor)
            start_monitoring
            ;;
        start-apps)
            start_applications
            ;;
        stop)
            stop_all
            ;;
        restart)
            stop_all
            start_all
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "${2:-}"
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
