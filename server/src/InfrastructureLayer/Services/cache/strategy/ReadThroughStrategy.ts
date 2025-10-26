import { ICacheStrategy } from 'src/DataLayer/Abstracts/Interfaces/ICacheStrategy';
import { RedisService } from '../../redis/RedisService';
import { Logger } from '@nestjs/common';

export class ReadThroughStrategy implements ICacheStrategy {
  private readonly logger = new Logger(ReadThroughStrategy.name);
  private readonly redisService: RedisService;

  constructor(redisService: RedisService) {
    this.redisService = redisService;
  }

  async get<T>(
    key: string,
    dataLoader?: () => Promise<T>,
    ttl?: number,
  ): Promise<T | null> {
    const client = await this.redisService.getClient();
    const cachedData = await client.get(key);

    if (cachedData) {
      this.logger.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData) as T;
    }

    if (dataLoader) {
      this.logger.log(`Cache miss for key: ${key}`);
      const freshData = await dataLoader();
      await this.set(key, freshData, ttl);
      return freshData;
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const client = await this.redisService.getClient();
    const data = JSON.stringify(value);
    if (ttl) {
      await client.set(key, data, { EX: ttl });
    } else {
      await client.set(key, data);
    }
    this.logger.log(`Cache set for key: ${key}`);
  }

  async popFromQueue<T>(queueName: string): Promise<T | null> {
    const client = await this.redisService.getClient();
    const data = await client.lPop(queueName);

    if (data) {
      this.logger.log(`No data in queue: ${queueName}`);
      return JSON.parse(data) as T;
    }

    return null;
  }

  async delete(key: string): Promise<void> {
    const client = await this.redisService.getClient();
    await client.del(key);
    this.logger.log(`Cache deleted for key: ${key}`);
  }
}
