import { RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';
import { RedisService } from './RedisService';

class RedisSubscriber {
  private logger = new Logger(RedisSubscriber.name);
  private client: RedisClientType | null = null;
  private redisService: RedisService;

  constructor() {
    this.redisService = new RedisService();
  }

  public async close(): Promise<void> {
    try {
      if (this.client?.isOpen) {
        await this.client.unsubscribe();
        await this.redisService.disconnect();
      }
    } catch (error) {
      this.logger.error({ msg: 'Error closing Redis subscriber', error });
    }
  }
}

export default RedisSubscriber;
