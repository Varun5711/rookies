# Infrastructure Docker Compose

This directory contains the Docker Compose configuration for running the infrastructure services required by the Ingenium platform.

## Services

- **PostgreSQL** (Port 5432) - Main database
- **Redis** (Port 6379) - Caching and session management
- **Zookeeper** (Port 2181) - Required for Kafka coordination
- **Kafka** (Ports 9092, 9093) - Event streaming platform
- **Kafka UI** (Port 8080) - Web interface for Kafka management

## Quick Start

### Start all infrastructure services:

```bash
docker-compose up -d
```

### Stop all services:

```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes data):

```bash
docker-compose down -v
```

### View logs:

```bash
docker-compose logs -f
```

### View logs for a specific service:

```bash
docker-compose logs -f postgres
docker-compose logs -f kafka
docker-compose logs -f redis
```

## Environment Variables

You can customize the services using environment variables. Create a `.env` file in this directory or set them in your shell:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ingenium

# Redis (defaults work out of the box)
# Kafka (defaults work out of the box)
```

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| PostgreSQL | `localhost:5432` | Database connection |
| Redis | `localhost:6379` | Redis connection |
| Kafka | `localhost:9092` | Kafka broker (external) |
| Kafka | `kafka:9093` | Kafka broker (internal Docker network) |
| Kafka UI | http://localhost:8080 | Web interface for Kafka |

## Health Checks

All services include health checks. You can verify they're running:

```bash
docker-compose ps
```

All services should show as "healthy" or "Up".

## Data Persistence

Data is persisted in Docker volumes:
- `postgres_data` - PostgreSQL data
- `redis_data` - Redis data

To remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

### Port already in use

If you get port conflicts, you can modify the port mappings in `docker-compose.yml` or stop the conflicting service.

### Kafka not starting

Kafka depends on Zookeeper. Make sure Zookeeper is healthy before Kafka starts:

```bash
docker-compose logs zookeeper
docker-compose logs kafka
```

### Reset everything

To completely reset all infrastructure:

```bash
docker-compose down -v
docker-compose up -d
```

## Integration with mprocs

The infrastructure is configured to start automatically when using `mprocs`. The `infra` process in `mprocs.yaml` will start all Docker containers.
