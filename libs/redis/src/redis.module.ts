import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { SessionService } from './session.service';
import { REDIS_CLIENT } from './constants/redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './interfaces/redis-config.interface';

@Global()
@Module({})
export class RedisModule {
  static register(options: RedisModuleOptions): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const redis = new Redis({
          host: options.host,
          port: options.port,
          password: options.password,
          db: options.db || 0,
          keyPrefix: options.keyPrefix,
          retryStrategy: options.retryStrategy,
          lazyConnect: options.lazyConnect ?? true,
          enableReadyCheck: options.enableReadyCheck ?? true,
          maxRetriesPerRequest: options.maxRetriesPerRequest ?? 3,
        });

        redis.on('connect', () => console.log('✅ Redis connected'));
        redis.on('ready', () => console.log('✅ Redis ready'));
        redis.on('error', (err) => console.error('❌ Redis error:', err.message));
        redis.on('close', () => console.warn('⚠️ Redis closed'));
        redis.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

        return redis;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService, SessionService],
      exports: [REDIS_CLIENT, RedisService, SessionService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_CLIENT,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);

        const redis = new Redis({
          host: config.host,
          port: config.port,
          password: config.password,
          db: config.db || 0,
          keyPrefix: config.keyPrefix,
          retryStrategy: config.retryStrategy,
          lazyConnect: config.lazyConnect ?? true,
          enableReadyCheck: config.enableReadyCheck ?? true,
          maxRetriesPerRequest: config.maxRetriesPerRequest ?? 3,
        });

        redis.on('connect', () => console.log('✅ Redis connected'));
        redis.on('ready', () => console.log('✅ Redis ready'));
        redis.on('error', (err) => console.error('❌ Redis error:', err.message));
        redis.on('close', () => console.warn('⚠️ Redis closed'));
        redis.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

        if (config.lazyConnect) {
          await redis.connect();
        }

        return redis;
      },
      inject: options.inject || [],
    };

    return {
      module: RedisModule,
      imports: options.imports || [],
      providers: [redisProvider, RedisService, SessionService],
      exports: [REDIS_CLIENT, RedisService, SessionService],
    };
  }
}