# Setup Guide - Kafka & Redis Libraries

This guide will help you install the required dependencies and configure environment variables for the Kafka and Redis libraries.

## 📦 Dependencies to Install

Run the following command to install all required dependencies:

```bash
bun install
```

**Note:** This project uses **Bun** as the package manager (as configured in `nx.json`).

### Core Dependencies Added

The following dependencies have been added to `package.json`:

#### Runtime Dependencies:
- **`@nestjs/config`** (^3.3.0) - Configuration management for NestJS
- **`@nestjs/microservices`** (^11.0.0) - NestJS microservices support (required for Kafka)
- **`ioredis`** (^5.3.2) - Redis client for Node.js
- **`kafkajs`** (^2.2.4) - Kafka client for Node.js
- **`uuid`** (^9.0.1) - UUID generation (used in session service)

#### Development Dependencies:
- **`@types/ioredis`** (^5.0.0) - TypeScript types for ioredis
- **`@types/uuid`** (^9.0.8) - TypeScript types for uuid

## 🔧 Environment Variables

A `.env.example` file has been created in the root directory. Copy it to `.env` and configure the values:

```bash
cp .env.example .env
```

### Required Environment Variables

#### Redis Configuration
```env
REDIS_HOST=localhost          # Redis server host
REDIS_PORT=6379              # Redis server port
REDIS_PASSWORD=              # Redis password (leave empty if no password)
REDIS_DB=0                   # Redis database number
REDIS_KEY_PREFIX=dpi:        # Prefix for all Redis keys
```

#### Kafka Configuration
```env
KAFKA_BROKERS=localhost:9092                          # Kafka broker address(es)
KAFKA_CLIENT_ID=api-gateway                          # Unique client ID for each service
KAFKA_CONSUMER_GROUP_ID=api-gateway-consumer-group   # Consumer group ID
```

**Note:** Each microservice should have its own `KAFKA_CLIENT_ID`:
- `api-gateway` → `KAFKA_CLIENT_ID=api-gateway`
- `auth-svc` → `KAFKA_CLIENT_ID=auth-svc`
- `healthcare-svc` → `KAFKA_CLIENT_ID=healthcare-svc`
- `agriculture-svc` → `KAFKA_CLIENT_ID=agriculture-svc`
- `urban-svc` → `KAFKA_CLIENT_ID=urban-svc`

### Optional Environment Variables

The `.env.example` file also includes optional variables for:
- PostgreSQL database configuration
- JWT configuration (for auth service)
- DigiLocker OAuth configuration
- Notification service configuration (SMS/Email)

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your configuration:**
   - Set `REDIS_HOST` and `REDIS_PORT` if Redis is not on localhost:6379
   - Set `KAFKA_BROKERS` if Kafka is not on localhost:9092
   - Configure other variables as needed

4. **Start infrastructure (if using Docker Compose):**
   ```bash
   docker-compose up -d
   ```

5. **Verify connections:**
   - Redis should be accessible at `REDIS_HOST:REDIS_PORT`
   - Kafka should be accessible at the broker address(es) specified in `KAFKA_BROKERS`

## 📚 Usage in Your Services

### Using Redis Module

```typescript
import { RedisModule } from '@dpi/redis';

@Module({
  imports: [
    RedisModule.register({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'dpi:',
    }),
  ],
})
export class AppModule {}
```

### Using Kafka Module

```typescript
import { KafkaModule } from '@dpi/kafka';

@Module({
  imports: [
    KafkaModule.register({
      clientId: process.env.KAFKA_CLIENT_ID || 'api-gateway',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    }),
  ],
})
export class AppModule {}
```

For more examples, refer to the library source code in `libs/kafka` and `libs/redis`.

## 🐳 Docker Compose (Optional)

If you want to run Redis and Kafka using Docker Compose, create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

volumes:
  redis_data:
```

Then run:
```bash
docker-compose up -d
```

## ✅ Verification

To verify everything is set up correctly:

1. **Test Redis connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. **Test Kafka connection:**
   ```bash
   # Using kafkajs or a Kafka client tool
   # Check if Kafka broker is accessible at KAFKA_BROKERS
   ```

## 📖 Additional Resources

- [KafkaJS Documentation](https://kafka.js.org/)
- [ioredis Documentation](https://github.com/redis/ioredis)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
