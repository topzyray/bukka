export interface ICacheStrategy {
  /**
   * Retrieves data from the cache or fetches it using a data loader if not found.
   * @param key The cache key.
   * @param dataLoader A function to fetch the data if it's not in the cache.
   * @param ttl Time-to-live for the cached data, in seconds.
   * @returns The cached or freshly loaded data.
   */
  get<T>(
    key: string,
    dataLoader?: () => Promise<T>,
    ttl?: number,
  ): Promise<T | null>;

  /**
   * Stores data in the cache with an optional TTL.
   * @param key The cache key.
   * @param value The value to store.
   * @param ttl Time-to-live for the cached data, in seconds.
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Gets data from the top of a redis queue
   * @param queueName The queue name
   */
  popFromQueue<T>(queueName: string): Promise<T | null>;

  /**
   * Deletes data from the cache.
   * @param key The cache key.
   */
  delete(key: string): Promise<void>;
}
