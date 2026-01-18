# Production Environment Configuration
project_name = "bharatsetu"
environment  = "prod"
aws_region   = "ap-south-1"

# VPC
vpc_cidr = "10.1.0.0/16"

# EKS
eks_cluster_version = "1.28"
eks_node_groups = {
  general = {
    instance_types = ["t3.large", "t3.xlarge"]
    capacity_type  = "ON_DEMAND"
    scaling_config = {
      desired_size = 3
      max_size     = 10
      min_size     = 3
    }
    labels = {
      role = "general"
    }
    taints = []
  }
  compute = {
    instance_types = ["c5.xlarge", "c5.2xlarge"]
    capacity_type  = "SPOT"
    scaling_config = {
      desired_size = 3
      max_size     = 15
      min_size     = 2
    }
    labels = {
      role = "compute"
    }
    taints = [{
      key    = "workload"
      value  = "compute"
      effect = "NO_SCHEDULE"
    }]
  }
  memory = {
    instance_types = ["r5.large", "r5.xlarge"]
    capacity_type  = "SPOT"
    scaling_config = {
      desired_size = 2
      max_size     = 8
      min_size     = 1
    }
    labels = {
      role = "memory"
    }
    taints = [{
      key    = "workload"
      value  = "memory"
      effect = "NO_SCHEDULE"
    }]
  }
}

# RDS
rds_instance_class    = "db.r5.large"
rds_allocated_storage = 500
rds_master_username   = "bharatsetu_admin"

# Redis
redis_node_type = "cache.r5.large"

# Kafka
kafka_instance_type = "kafka.m5.large"
kafka_storage_size  = 500

# Monitoring
enable_container_insights = true
log_retention_days        = 90

# Domain
domain_name    = "bharatsetu.gov.in"
hosted_zone_id = "ZXXXXXXXXXXXXXXXXX"
