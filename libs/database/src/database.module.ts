import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database Module
 * Configures TypeORM with PostgreSQL connection
 * Uses environment variables for configuration
 */
@Module({})
export class DatabaseModule {
  /**
   * Create a global TypeORM module with PostgreSQL configuration
   * @returns DynamicModule configured with TypeORM
   */
  static forRoot(): DynamicModule {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'ingenium',

      // Auto-load entities from all services
      // In production, use migrations instead of synchronize
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',

      // Enable logging in development
      logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,

      // Connection pool settings
      extra: {
        max: 20, // maximum number of clients in the pool
        min: 5,  // minimum number of clients in the pool
      },
    };

    return {
      module: DatabaseModule,
      global: true,
      imports: [TypeOrmModule.forRoot(options)],
      exports: [TypeOrmModule],
    };
  }
}
