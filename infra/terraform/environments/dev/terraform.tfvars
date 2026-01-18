# Development Environment Configuration
project_name = "bharatsetu"
environment  = "dev"
aws_region   = "ap-south-1"

# VPC
vpc_cidr = "10.0.0.0/16"

# EKS
eks_cluster_version = "1.28"
eks_node_groups = {
  general = {
    instance_types = ["t3.medium"]
    capacity_type  = "ON_DEMAND"
    scaling_config = {
      desired_size = 2
      max_size     = 4
      min_size     = 1
    }
    labels = {
      role = "general"
    }
    taints = []
  }
}

# RDS
rds_instance_class    = "db.t3.medium"
rds_allocated_storage = 50
rds_master_username   = "bharatsetu_admin"

# Redis
redis_node_type = "cache.t3.micro"

# Kafka
kafka_instance_type = "kafka.t3.small"
kafka_storage_size  = 50

# Monitoring
enable_container_insights = true
log_retention_days        = 14

# Domain
domain_name = "dev.bharatsetu.gov.in"
