import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database Module Options
 * Configuration options for per-service database setup
 */
export interface DatabaseModuleOptions {
  /**
   * Service-specific database name
   * Falls back to environment variable pattern: DB_DATABASE_{SERVICE_NAME}
   */
  database?: string;

  /**
   * Service name used to construct environment variable names
   * Example: 'AUTH' -> DB_DATABASE_AUTH
   */
  serviceName?: string;

  /**
   * Override global connection settings
   */
  host?: string;
  port?: number;
  username?: string;
  password?: string;
}

/**
 * Database Module
 * Configures TypeORM with PostgreSQL connection
 * Supports per-service database configuration
 */
@Module({})
export class DatabaseModule {
  /**
   * Create a global TypeORM module with PostgreSQL configuration
   * Supports per-service database selection
   *
   * @param options - Configuration options
   * @returns DynamicModule configured with TypeORM
   *
   * @example
   * // In auth-svc/app.module.ts
   * DatabaseModule.forRoot({ serviceName: 'AUTH' })
   *
   * @example
   * // Explicit database name
   * DatabaseModule.forRoot({ database: 'ingenium_auth' })
   */
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    const database = this.resolveDatabaseName(options);

    const connectionOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      host: options.host || process.env.DB_HOST || 'localhost',
      port: options.port || parseInt(process.env.DB_PORT || '5432', 10),
      username: options.username || process.env.DB_USERNAME || 'postgres',
      password: options.password || process.env.DB_PASSWORD || 'postgres',
      database,

      // Auto-load entities from the service
      autoLoadEntities: true,

      // Synchronize schema (ONLY in development)
      // In production, use migrations
      synchronize: process.env.DB_SYNCHRONIZE === 'true',

      // Enable logging in development
      logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,

      // Connection pool settings
      extra: {
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        min: parseInt(process.env.DB_POOL_MIN || '5', 10),
      },

      // Retry connection logic
      retryAttempts: 5,
      retryDelay: 3000,
    };

    // Log database connection (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗄️  Connecting to database: ${database}`);
    }

    return {
      module: DatabaseModule,
      global: true,
      imports: [TypeOrmModule.forRoot(connectionOptions)],
      exports: [TypeOrmModule],
    };
  }

  /**
   * Resolve database name from options or environment variables
   */
  private static resolveDatabaseName(options: DatabaseModuleOptions): string {
    // Priority 1: Explicit database name
    if (options.database) {
      return options.database;
    }

    // Priority 2: Service-specific environment variable
    if (options.serviceName) {
      const envVar = `DB_DATABASE_${options.serviceName.toUpperCase()}`;
      const databaseFromEnv = process.env[envVar];
      if (databaseFromEnv) {
        return databaseFromEnv;
      }
    }

    // Priority 3: Global database environment variable (backward compatibility)
    if (process.env.DB_DATABASE) {
      return process.env.DB_DATABASE;
    }

    // Priority 4: Default fallback
    return 'ingenium';
  }
}
