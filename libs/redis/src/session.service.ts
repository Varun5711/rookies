import { Injectable, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT } from './constants/redis.constants';


const SESSION_TTL = 14 * 24 * 60 * 60;

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  ip: string;
  userAgent: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  refreshTokenHash: string;
  device: DeviceInfo;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

export interface ExistingSessionInfo {
  sessionId: string;
  device: DeviceInfo;
  createdAt: string;
  lastActivityAt: string;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly keyPrefix = 'session:';
  private readonly indexPrefix = 'session:index:';

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async createSession(
    userId: string,
    refreshTokenHash: string,
    device: DeviceInfo,
  ): Promise<Session> {
    const sessionId = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + SESSION_TTL * 1000).toISOString();

    const session: Session = {
      sessionId,
      userId,
      refreshTokenHash,
      device,
      createdAt: now,
      lastActivityAt: now,
      expiresAt,
    };

    const sessionKey = `${this.keyPrefix}${userId}:${sessionId}`;
    const indexKey = `${this.indexPrefix}${userId}`;

    try {
      
      await this.redis.setex(sessionKey, SESSION_TTL, JSON.stringify(session));

      
      await this.redis.sadd(indexKey, sessionId);
      await this.redis.expire(indexKey, SESSION_TTL);

      this.logger.log(`Created session ${sessionId} for user ${userId}`);
      return session;
    } catch (error) {
      this.logger.error(`Failed to create session for user ${userId}:`, error);
      throw error;
    }
  }

  async getSession(userId: string, sessionId: string): Promise<Session | null> {
    const sessionKey = `${this.keyPrefix}${userId}:${sessionId}`;

    try {
      const data = await this.redis.get(sessionKey);
      if (!data) return null;
      return JSON.parse(data) as Session;
    } catch (error) {
      this.logger.error(`Failed to get session ${sessionId}:`, error);
      return null;
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const indexKey = `${this.indexPrefix}${userId}`;

    try {
      const sessionIds = await this.redis.smembers(indexKey);
      if (!sessionIds.length) return [];

      const sessions: Session[] = [];
      for (const sessionId of sessionIds) {
        const session = await this.getSession(userId, sessionId);
        if (session) {
          sessions.push(session);
        } else {
          
          await this.redis.srem(indexKey, sessionId);
        }
      }

      
      return sessions.sort((a, b) =>
        new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );
    } catch (error) {
      this.logger.error(`Failed to get sessions for user ${userId}:`, error);
      return [];
    }
  }

  async getExistingSession(userId: string): Promise<ExistingSessionInfo | null> {
    const sessions = await this.getUserSessions(userId);
    if (sessions.length === 0) return null;

    
    const session = sessions[0];
    return {
      sessionId: session.sessionId,
      device: session.device,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
    };
  }

  async hasExistingSession(userId: string): Promise<boolean> {
    const indexKey = `${this.indexPrefix}${userId}`;
    try {
      const count = await this.redis.scard(indexKey);
      return count > 0;
    } catch (error) {
      this.logger.error(`Failed to check existing session for user ${userId}:`, error);
      return false;
    }
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const sessionKey = `${this.keyPrefix}${userId}:${sessionId}`;
    const indexKey = `${this.indexPrefix}${userId}`;

    try {
      const deleted = await this.redis.del(sessionKey);
      await this.redis.srem(indexKey, sessionId);

      if (deleted > 0) {
        this.logger.log(`Revoked session ${sessionId} for user ${userId}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to revoke session ${sessionId}:`, error);
      return false;
    }
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const indexKey = `${this.indexPrefix}${userId}`;

    try {
      const sessionIds = await this.redis.smembers(indexKey);
      if (!sessionIds.length) return 0;

      
      const sessionKeys = sessionIds.map(id => `${this.keyPrefix}${userId}:${id}`);
      await this.redis.del(...sessionKeys, indexKey);

      this.logger.log(`Revoked ${sessionIds.length} sessions for user ${userId}`);
      return sessionIds.length;
    } catch (error) {
      this.logger.error(`Failed to revoke all sessions for user ${userId}:`, error);
      return 0;
    }
  }

  async touchSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.getSession(userId, sessionId);
    if (!session) return;

    session.lastActivityAt = new Date().toISOString();

    const sessionKey = `${this.keyPrefix}${userId}:${sessionId}`;
    const ttl = await this.redis.ttl(sessionKey);

    try {
      if (ttl > 0) {
        await this.redis.setex(sessionKey, ttl, JSON.stringify(session));
      }
    } catch (error) {
      this.logger.error(`Failed to touch session ${sessionId}:`, error);
    }
  }

  async updateSessionRefreshToken(
    userId: string,
    sessionId: string,
    newRefreshTokenHash: string,
  ): Promise<void> {
    const session = await this.getSession(userId, sessionId);
    if (!session) {
      this.logger.warn(`Cannot update refresh token: session ${sessionId} not found`);
      return;
    }

    session.refreshTokenHash = newRefreshTokenHash;
    session.lastActivityAt = new Date().toISOString();

    const sessionKey = `${this.keyPrefix}${userId}:${sessionId}`;
    const ttl = await this.redis.ttl(sessionKey);

    try {
      if (ttl > 0) {
        await this.redis.setex(sessionKey, ttl, JSON.stringify(session));
        this.logger.log(`Updated refresh token for session ${sessionId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update session refresh token ${sessionId}:`, error);
      throw error;
    }
  }

  async validateSession(
    userId: string,
    sessionId: string,
    refreshTokenHash: string,
  ): Promise<boolean> {
    const session = await this.getSession(userId, sessionId);
    if (!session) {
      this.logger.debug(`Session ${sessionId} not found for user ${userId}`);
      return false;
    }

    if (session.refreshTokenHash !== refreshTokenHash) {
      this.logger.warn(`Refresh token mismatch for session ${sessionId}`);
      return false;
    }

    
    if (new Date(session.expiresAt) < new Date()) {
      this.logger.debug(`Session ${sessionId} has expired`);
      await this.revokeSession(userId, sessionId);
      return false;
    }

    return true;
  }

  async getSessionByRefreshToken(
    userId: string,
    refreshTokenHash: string,
  ): Promise<Session | null> {
    const sessions = await this.getUserSessions(userId);
    return sessions.find(s => s.refreshTokenHash === refreshTokenHash) || null;
  }
}