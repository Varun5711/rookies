# BharatSetu DPI Platform - Infrastructure

This directory contains all infrastructure-as-code (IaC) for deploying the BharatSetu Digital Public Infrastructure platform.

## 📁 Directory Structure

```
infra/
├── docker-compose.yml          # Complete Docker Compose stack
├── dockerfiles/                # Dockerfiles for all services
│   ├── Dockerfile.api-gateway
│   ├── Dockerfile.auth-svc
│   ├── Dockerfile.healthcare-svc
│   ├── Dockerfile.agriculture-svc
│   ├── Dockerfile.urban-svc
│   ├── Dockerfile.notification-svc
│   ├── Dockerfile.audit-svc
│   ├── Dockerfile.analytics-svc
│   ├── Dockerfile.service-registry
│   └── Dockerfile.dpi-client
├── kubernetes/                  # Kubernetes manifests
│   ├── base/                   # Base resources
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   ├── secrets.yaml
│   │   ├── rbac.yaml
│   │   └── [service].yaml      # Deployment for each service
│   ├── ingress/                # Ingress configuration
│   │   └── ingress.yaml
│   └── monitoring/             # Monitoring stack
│       ├── prometheus.yaml
│       ├── grafana.yaml
│       └── alertmanager.yaml
├── terraform/                   # Terraform IaC
│   ├── main.tf                 # Main configuration
│   ├── variables.tf            # Variable definitions
│   ├── modules/                # Terraform modules
│   │   ├── vpc/               # VPC module
│   │   ├── eks/               # EKS module
│   │   └── rds/               # RDS module
│   └── environments/           # Environment-specific configs
│       ├── dev/
│       └── prod/
├── monitoring/                  # Monitoring configuration
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── alert_rules.yml
│   ├── grafana/
│   │   └── provisioning/
│   └── alertmanager/
│       └── alertmanager.yml
└── scripts/                     # Deployment scripts
    ├── deploy-docker.sh
    ├── deploy-k8s.sh
    ├── deploy-terraform.sh
    └── build-images.sh
```

## 🚀 Quick Start

### Local Development (Docker Compose)

```bash
# Navigate to infra directory
cd infra

# Start infrastructure services only
docker compose up -d postgres redis zookeeper kafka clickhouse

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Using Deployment Scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy with Docker
./scripts/deploy-docker.sh start

# Build and push images
DOCKER_REGISTRY=your-registry ./scripts/build-images.sh build-push

# Deploy to Kubernetes
DOCKER_REGISTRY=your-registry IMAGE_TAG=v1.0.0 ./scripts/deploy-k8s.sh deploy

# Deploy Terraform infrastructure
ENVIRONMENT=dev ./scripts/deploy-terraform.sh apply
```

## 🐳 Docker Compose

The `docker-compose.yml` includes:

### Infrastructure Services
- **PostgreSQL** (port 5432) - Main database
- **Redis** (port 6379) - Caching and sessions
- **Kafka** (port 9092) - Event streaming
- **ClickHouse** (port 8123) - Analytics database

### Application Services
- **API Gateway** (port 3000)
- **Auth Service** (port 3001)
- **Healthcare Service** (port 3002)
- **Agriculture Service** (port 3003)
- **Urban Service** (port 3004)
- **Notification Service** (port 3005)
- **Audit Service** (port 3006)
- **Analytics Service** (port 3007)
- **Service Registry** (port 3010)
- **DPI Client** (port 3080)

### Monitoring Stack
- **Prometheus** (port 9090)
- **Grafana** (port 3030)
- **AlertManager** (port 9093)
- **Node Exporter** (port 9100)
- **cAdvisor** (port 8081)

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes

```bash
# Set environment variables
export DOCKER_REGISTRY=your-registry
export IMAGE_TAG=latest

# Deploy all components
./scripts/deploy-k8s.sh deploy

# Check status
kubectl get pods -n bharatsetu

# View logs
kubectl logs -f deployment/api-gateway -n bharatsetu
```

### Key Features
- Horizontal Pod Autoscaling (HPA)
- Pod Disruption Budgets
- Network Policies
- RBAC configuration
- Ingress with TLS
- Prometheus service discovery

## 🏗️ Terraform (AWS)

### Prerequisites
- AWS CLI configured
- Terraform >= 1.5.0

### Infrastructure Components
- **VPC** with public/private subnets
- **EKS** cluster with managed node groups
- **RDS** PostgreSQL with Multi-AZ
- **ElastiCache** Redis cluster
- **MSK** Kafka cluster
- **ECR** repositories
- **S3** + CloudFront for assets

### Deploy Infrastructure

```bash
# Setup Terraform backend
ENVIRONMENT=dev ./scripts/deploy-terraform.sh setup-backend

# Initialize and plan
ENVIRONMENT=dev ./scripts/deploy-terraform.sh plan

# Apply changes
ENVIRONMENT=dev ./scripts/deploy-terraform.sh apply

# Configure kubectl for EKS
ENVIRONMENT=dev ./scripts/deploy-terraform.sh configure-kubectl
```

## 📊 Monitoring

### Prometheus
- Scrapes metrics from all services
- Alert rules for infrastructure and applications
- 30-day retention

### Grafana
Access at: http://localhost:3030
- Default credentials: admin/admin
- Pre-configured dashboards
- Prometheus datasource auto-configured

### AlertManager
- Email notifications
- Slack integration (configurable)
- Route-based alert routing

## 🔒 Security

### Best Practices Implemented
- Non-root containers
- Read-only root filesystem
- Network policies
- Secrets management
- TLS encryption
- Image scanning

### Production Recommendations
1. Use external secret management (AWS Secrets Manager, HashiCorp Vault)
2. Enable Pod Security Policies/Standards
3. Implement WAF at ingress
4. Use private endpoints for databases
5. Enable audit logging

## 📝 Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example ../.env
```

Key variables:
- `JWT_SECRET` - JWT signing key
- `POSTGRES_PASSWORD` - Database password
- `DOCKER_REGISTRY` - Container registry URL
- `TWILIO_*` - SMS configuration

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and push images
        env:
          DOCKER_REGISTRY: ${{ secrets.ECR_REGISTRY }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          ./infra/scripts/build-images.sh login
          ./infra/scripts/build-images.sh build-push
      
      - name: Deploy to Kubernetes
        env:
          DOCKER_REGISTRY: ${{ secrets.ECR_REGISTRY }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          ./infra/scripts/deploy-k8s.sh deploy
```

## 🛠️ Troubleshooting

### Common Issues

**Services not starting:**
```bash
# Check logs
docker compose logs -f <service-name>

# Check container health
docker compose ps
```

**Kubernetes pods pending:**
```bash
# Check events
kubectl get events -n bharatsetu

# Describe pod
kubectl describe pod <pod-name> -n bharatsetu
```

**Database connection issues:**
```bash
# Check if database is ready
docker compose exec postgres pg_isready -U postgres
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
