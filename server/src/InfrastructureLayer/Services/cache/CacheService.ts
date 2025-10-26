import { ICacheStrategy } from 'src/DataLayer/Abstracts/Interfaces/ICacheStrategy';

export class CacheService {
  private readonly strategy: ICacheStrategy;

  constructor(strategy: ICacheStrategy) {
    this.strategy = strategy;
  }

  async get<T>(
    key: string,
    dataLoader?: () => Promise<T>,
    ttl?: number,
  ): Promise<T | null> {
    return this.strategy.get(key, dataLoader, ttl);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.strategy.set(key, value, ttl);
  }

  async popFromQueue<T>(queueName: string): Promise<T | null> {
    return this.strategy.popFromQueue(queueName);
  }

  async delete(key: string): Promise<void> {
    return this.strategy.delete(key);
  }
}
