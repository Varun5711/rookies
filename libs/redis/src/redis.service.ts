import { Injectable, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './constants/redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.setex(key, ttl, serialized);
      } else {
        await this.redisClient.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Failed to set key ${key}:`, error);
      throw error;
    }
  }

  async del(...keys: string[]): Promise<number> {
    try {
      return await this.redisClient.del(...keys);
    } catch (error) {
      this.logger.error(`Failed to delete keys ${keys}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence of key ${key}:`, error);
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to set expiration on key ${key}:`, error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redisClient.incr(key);
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}:`, error);
      throw error;
    }
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      return await this.redisClient.zadd(key, score, member);
    } catch (error) {
      this.logger.error(`Failed to zadd to ${key}:`, error);
      throw error;
    }
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.redisClient.zrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Failed to zrange ${key}:`, error);
      return [];
    }
  }

  async zrevrangeWithScores(
    key: string,
    start: number,
    stop: number,
  ): Promise<Array<{ member: string; score: number }>> {
    try {
      const results = await this.redisClient.zrevrange(key, start, stop, 'WITHSCORES');
      const parsed: Array<{ member: string; score: number }> = [];

      for (let i = 0; i < results.length; i += 2) {
        parsed.push({
          member: results[i],
          score: parseFloat(results[i + 1]),
        });
      }

      return parsed;
    } catch (error) {
      this.logger.error(`Failed to zrevrange ${key}:`, error);
      return [];
    }
  }

  async zrank(key: string, member: string): Promise<number | null> {
    try {
      return await this.redisClient.zrank(key, member);
    } catch (error) {
      this.logger.error(`Failed to zrank ${key}:`, error);
      return null;
    }
  }

  async zcard(key: string): Promise<number> {
    try {
      return await this.redisClient.zcard(key);
    } catch (error) {
      this.logger.error(`Failed to zcard ${key}:`, error);
      return 0;
    }
  }

  async zrem(key: string, member: string): Promise<number> {
    try {
      return await this.redisClient.zrem(key, member);
    } catch (error) {
      this.logger.error(`Failed to zrem from ${key}:`, error);
      throw error;
    }
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.redisClient.rpush(key, ...values);
    } catch (error) {
      this.logger.error(`Failed to rpush to ${key}:`, error);
      throw error;
    }
  }

  async lpop(key: string): Promise<string | null> {
    try {
      return await this.redisClient.lpop(key);
    } catch (error) {
      this.logger.error(`Failed to lpop from ${key}:`, error);
      return null;
    }
  }

  async acquireLock(key: string, ttl: number): Promise<string | null> {
    try {
      const token = `${Date.now()}-${Math.random()}`;
      const result = await this.redisClient.set(key, token, 'EX', ttl, 'NX');
      return result === 'OK' ? token : null;
    } catch (error) {
      this.logger.error(`Failed to acquire lock ${key}:`, error);
      return null;
    }
  }

  async releaseLock(key: string, token: string): Promise<boolean> {
    try {
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      const result = await this.redisClient.eval(script, 1, key, token);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to release lock ${key}:`, error);
      return false;
    }
  }

  async extendLock(key: string, token: string, ttl: number): Promise<boolean> {
    try {
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("expire", KEYS[1], ARGV[2])
        else
          return 0
        end
      `;
      const result = await this.redisClient.eval(script, 1, key, token, ttl);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to extend lock ${key}:`, error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.redisClient.del(...keys);
    } catch (error) {
      this.logger.error(`Failed to delete pattern ${pattern}:`, error);
      throw error;
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redisClient.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis ping failed:', error);
      return false;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis...');
    await this.redisClient.quit();
  }
}