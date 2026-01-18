#!/bin/bash
# ============================================================================
# BharatSetu DPI Platform - Terraform Deployment Script
# ============================================================================
# This script manages Terraform infrastructure deployment
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
TERRAFORM_DIR="$PROJECT_ROOT/infra/terraform"
ENVIRONMENT="${ENVIRONMENT:-dev}"

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
    
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please configure AWS credentials."
        exit 1
    fi
    
    log_success "All prerequisites are met."
}

# Initialize Terraform
init() {
    log_info "Initializing Terraform..."
    
    cd "$TERRAFORM_DIR"
    
    terraform init \
        -backend-config="environments/$ENVIRONMENT/backend.tfvars" \
        -reconfigure
    
    log_success "Terraform initialized."
}

# Validate configuration
validate() {
    log_info "Validating Terraform configuration..."
    
    cd "$TERRAFORM_DIR"
    
    terraform validate
    
    log_success "Configuration is valid."
}

# Format configuration
format() {
    log_info "Formatting Terraform configuration..."
    
    cd "$TERRAFORM_DIR"
    
    terraform fmt -recursive
    
    log_success "Configuration formatted."
}

# Plan infrastructure changes
plan() {
    log_info "Planning infrastructure changes for $ENVIRONMENT..."
    
    cd "$TERRAFORM_DIR"
    
    terraform plan \
        -var-file="environments/$ENVIRONMENT/terraform.tfvars" \
        -out="tfplan-$ENVIRONMENT"
    
    log_success "Plan created: tfplan-$ENVIRONMENT"
}

# Apply infrastructure changes
apply() {
    log_info "Applying infrastructure changes for $ENVIRONMENT..."
    
    cd "$TERRAFORM_DIR"
    
    if [ -f "tfplan-$ENVIRONMENT" ]; then
        terraform apply "tfplan-$ENVIRONMENT"
    else
        log_warning "No plan file found. Running plan first..."
        terraform apply \
            -var-file="environments/$ENVIRONMENT/terraform.tfvars" \
            -auto-approve=false
    fi
    
    log_success "Infrastructure changes applied."
}

# Destroy infrastructure
destroy() {
    log_warning "This will DESTROY all infrastructure in $ENVIRONMENT!"
    log_warning "This action cannot be undone!"
    read -p "Type '$ENVIRONMENT' to confirm: " confirm
    
    if [ "$confirm" != "$ENVIRONMENT" ]; then
        log_info "Destruction cancelled."
        exit 0
    fi
    
    log_info "Destroying infrastructure for $ENVIRONMENT..."
    
    cd "$TERRAFORM_DIR"
    
    terraform destroy \
        -var-file="environments/$ENVIRONMENT/terraform.tfvars" \
        -auto-approve=false
    
    log_success "Infrastructure destroyed."
}

# Show current state
show_state() {
    log_info "Current infrastructure state for $ENVIRONMENT:"
    
    cd "$TERRAFORM_DIR"
    
    terraform show
}

# Show outputs
show_outputs() {
    log_info "Infrastructure outputs for $ENVIRONMENT:"
    
    cd "$TERRAFORM_DIR"
    
    terraform output
}

# Create S3 backend bucket and DynamoDB table
setup_backend() {
    log_info "Setting up Terraform backend..."
    
    local bucket_name="bharatsetu-terraform-state"
    local dynamodb_table="bharatsetu-terraform-locks"
    local region="ap-south-1"
    
    # Create S3 bucket
    if ! aws s3api head-bucket --bucket "$bucket_name" 2>/dev/null; then
        log_info "Creating S3 bucket: $bucket_name"
        aws s3api create-bucket \
            --bucket "$bucket_name" \
            --region "$region" \
            --create-bucket-configuration LocationConstraint="$region"
        
        aws s3api put-bucket-versioning \
            --bucket "$bucket_name" \
            --versioning-configuration Status=Enabled
        
        aws s3api put-bucket-encryption \
            --bucket "$bucket_name" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'
        
        log_success "S3 bucket created."
    else
        log_info "S3 bucket already exists."
    fi
    
    # Create DynamoDB table
    if ! aws dynamodb describe-table --table-name "$dynamodb_table" 2>/dev/null; then
        log_info "Creating DynamoDB table: $dynamodb_table"
        aws dynamodb create-table \
            --table-name "$dynamodb_table" \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
            --region "$region"
        
        log_success "DynamoDB table created."
    else
        log_info "DynamoDB table already exists."
    fi
    
    log_success "Backend setup completed."
}

# Configure kubectl for EKS
configure_kubectl() {
    log_info "Configuring kubectl for EKS cluster..."
    
    cd "$TERRAFORM_DIR"
    
    local cluster_name=$(terraform output -raw eks_cluster_name 2>/dev/null || echo "")
    local region=$(terraform output -raw aws_region 2>/dev/null || echo "ap-south-1")
    
    if [ -z "$cluster_name" ]; then
        log_error "Could not get EKS cluster name from Terraform outputs."
        exit 1
    fi
    
    aws eks update-kubeconfig \
        --name "$cluster_name" \
        --region "$region"
    
    log_success "kubectl configured for $cluster_name"
}

# Print usage
print_usage() {
    echo "Usage: ENVIRONMENT=<env> $0 <command>"
    echo ""
    echo "Commands:"
    echo "  setup-backend   Create S3 bucket and DynamoDB table for state"
    echo "  init            Initialize Terraform"
    echo "  validate        Validate configuration"
    echo "  format          Format configuration files"
    echo "  plan            Plan infrastructure changes"
    echo "  apply           Apply infrastructure changes"
    echo "  destroy         Destroy infrastructure"
    echo "  state           Show current state"
    echo "  outputs         Show outputs"
    echo "  configure-kubectl  Configure kubectl for EKS"
    echo "  help            Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  ENVIRONMENT     Target environment (dev, staging, prod)"
    echo ""
    echo "Examples:"
    echo "  ENVIRONMENT=dev $0 plan"
    echo "  ENVIRONMENT=prod $0 apply"
}

# Main
main() {
    check_prerequisites
    
    log_info "Target environment: $ENVIRONMENT"
    
    case "${1:-help}" in
        setup-backend)
            setup_backend
            ;;
        init)
            init
            ;;
        validate)
            init
            validate
            ;;
        format)
            format
            ;;
        plan)
            init
            plan
            ;;
        apply)
            init
            apply
            ;;
        destroy)
            init
            destroy
            ;;
        state)
            show_state
            ;;
        outputs)
            show_outputs
            ;;
        configure-kubectl)
            configure_kubectl
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
