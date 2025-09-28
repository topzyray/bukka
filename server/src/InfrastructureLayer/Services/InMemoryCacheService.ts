import cache from 'memory-cache';

export class InMemoryCacheService {
  static async saveToInMemory<T>(key: string, value: T) {
    if (key == null || value == null) {
      return;
    }
    if (!cache) {
      console.error('Memory cache is not initialized.');
      return;
    }
    await cache.put(key, value);
  }

  static getFromInMemory(key: string): any {
    if (key != null) {
      return cache.get(key);
    }
    return null;
  }
}
