import { Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

export class RedisService {
  private static instance: RedisService;
  private readonly client: RedisClientType;
  private readonly REDIS_PROTOCOL = 'rediss://';
  private readonly config = {
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    redisPassword: process.env.REDIS_PASSWORD,
    redisUrl: process.env.REDIS_URL,
    env: process.env.NODE_ENV as EnvironmentTypeEnum,
  };
  // private readonly url = `${this.REDIS_PROTOCOL}${this.config.redisHost}:${this.config.redisPort}`;
  private readonly url = `${this.config.redisUrl}`;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    let baseOptions: any = {
      url: this.url,
      password: this.config.redisPassword,
    };
    if (this.config.env === EnvironmentTypeEnum.PROD) {
      baseOptions.socket = {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 1000),
        timeout: 30000,
        tls: true,
      };
    }
    this.client = createClient(baseOptions);

    this.client.on('error', (error) =>
      this.logger.error('Redis Client Error', error),
    );
    this.client.on('connect', () =>
      this.logger.log('Redis Client Connecting....'),
    );
    this.client.on('ready', () =>
      this.logger.log('Redis Client Connected successfully!'),
    );
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

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      this.logger.error('Error disconnecting from Redis', error);
    }
  }
}
