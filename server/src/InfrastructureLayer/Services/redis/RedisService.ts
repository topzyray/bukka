import { Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import IORedis from 'ioredis';

export class RedisService {
  private static instance: RedisService;
  private readonly client: RedisClientType;
  private readonly bullConnection: IORedis;
  private readonly REDIS_SOCKET_PROTOCOL = 'rediss://';
  private readonly config = {
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    redisPassword: process.env.REDIS_PASSWORD,
    redisUrl: process.env.REDIS_URL as string,
    env: process.env.NODE_ENV as EnvironmentTypeEnum,
  };
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const isTls = this.config.redisUrl?.startsWith(this.REDIS_SOCKET_PROTOCOL);

    // const baseOptions: any = {
    //   url: this.config.redisUrl,
    //   password: this.config.redisPassword,
    //   socket: {
    //     reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
    //     timeout: 30000,
    //     ...(isTls ? { tls: true } : {}),
    //   },
    // };

    this.client = createClient({
      url: this.config.redisUrl,
      password: this.config.redisPassword,
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
        timeout: 30000,
        ...(isTls ? { tls: true } : {}),
      },
    });

    this.client.on('error', (error) =>
      this.logger.error('Redis Client Error', error),
    );
    this.client.on('connect', () =>
      this.logger.log('Redis Client Connecting....'),
    );
    this.client.on('ready', () =>
      this.logger.log('Redis Client Connected successfully!'),
    );

    // separate ioredis connection for BullMQ
    this.bullConnection = new IORedis(this.config.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      tls: isTls ? {} : undefined,
    });
  }

  /**
   * Returns the singleton instance of RedisService.
   * @returns {RedisService} The singleton RedisService instance.
   */
  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Error connecting to Redis', error);
    }
  }

  async getClient(): Promise<RedisClientType> {
    if (!this.client.isOpen) await this.client.connect();
    return this.client;
  }

  getBullConnection(): IORedis {
    this.logger.log('BullMQ Connection Initialized');
    return this.bullConnection;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) await this.client.disconnect();
      if (this.bullConnection.status !== 'end')
        await this.bullConnection.quit();
    } catch (error) {
      this.logger.error('Error disconnecting from Redis', error);
    }
  }
}
