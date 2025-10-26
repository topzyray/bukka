import { RedisHelper } from 'src/InfrastructureLayer/Helpers/RedisHelper';
import { CacheFactory } from './CacheFactory';
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis/RedisService';

const cacheService = CacheFactory.getReadThroughCache();

const logger = new Logger('CacheServiceUtils');

/**
 * Handles caching logic (get, set, del) for a given resource.
 * @param prefix - Cache key prefix (e.g., "company").
 * @param params - Parameters to include in the cache key.
 * @param fetchFunction - Function to fetch data if cache is empty.
 * @param ttl - Time-to-live for the cached data (default: 15 mins).
 */
export const handleCache = async <T>(
  prefix: string,
  params: Record<string, unknown>,
  fetchFunction: () => Promise<T>,
  ttl: number = 900,
): Promise<T> => {
  const cacheKey = RedisHelper.generateCacheKey(prefix, params);
  const result = await cacheService.get(
    cacheKey,
    async () => {
      logger.log(`Cache miss for key: ${cacheKey}. Fetching from database...`);
      return await fetchFunction();
    },
    ttl,
  );
  if (result === null) {
    throw new Error(`Cache miss returned null for key ${cacheKey}`);
  }
  return result;
};

/**
 * Deletes specific cache keys or all matching keys by prefix pattern.
 *
 * - If `params` are provided → deletes **exact key** only.
 * - If `params` are omitted or empty → deletes **all keys with prefix**.
 *
 * @param prefix - Cache key prefix.
 * @param params - Parameters to include in the cache key.
 *
 * Example:
 *  await invalidateCache('business', { id: 1 }); // deletes one key
 *  await invalidateCache('businesses'); // deletes all keys with 'businesses:*'
 */
export const invalidateCache = async (
  prefix: string,
  params?: Record<string, unknown>,
): Promise<void> => {
  const redisService = RedisService.getInstance();
  const client = await redisService.getClient();

  if (params && Object.keys(params).length > 0) {
    const cacheKey = RedisHelper.generateCacheKey(prefix, params);
    logger.log(`Invalidating specific cache for key: ${cacheKey}`);
    await cacheService.delete(cacheKey);
    return;
  }

  const pattern = `${prefix}:*`;
  logger.log(`Invalidating all cache keys matching pattern: ${pattern}`);

  const iter = client.scanIterator({ MATCH: pattern });
  const deletedKeys: string[] = [];

  // Handle both Redis clients that yield strings or string arrays
  for await (const batch of iter as AsyncIterable<string[] | string>) {
    if (Array.isArray(batch)) {
      for (const key of batch) {
        await client.del(key);
        deletedKeys.push(key);
      }
    } else {
      await client.del(batch);
      deletedKeys.push(batch);
    }
  }

  if (deletedKeys.length === 0) {
    logger.log(`No cache keys found for pattern: ${pattern}`);
  } else {
    logger.log(
      `Deleted ${deletedKeys.length} cache keys for pattern: ${pattern}`,
    );
  }
};

// /**
//  * Deletes a specific key from the cache.
//  * @param prefix - Cache key prefix.
//  * @param params - Parameters to include in the cache key.
//  */
// export const invalidateCache = async (
//   prefix: string,
//   params: Record<string, unknown>,
// ): Promise<void> => {
//   const cacheKey = RedisHelper.generateCacheKey(prefix, params);
//   logger.log(`Invalidating cache for key: ${cacheKey}`);
//   await cacheService.delete(cacheKey);
// };
