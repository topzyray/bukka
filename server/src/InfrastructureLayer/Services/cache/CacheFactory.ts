import { CacheService } from './CacheService';
import { RedisService } from '../redis/RedisService';
import { ReadThroughStrategy } from './strategy/ReadThroughStrategy';
import { CachePolicyEnum } from 'src/DomainLayer/Enums/CachePolicyEnum';

export class CacheFactory {
  private readonly redisService: RedisService;
  private static readonly cacheInstances: Map<CachePolicyEnum, CacheService> =
    new Map();

  constructor() {
    this.redisService = RedisService.getInstance();
  }

  private getCache(policy: CachePolicyEnum): CacheService {
    if (!CacheFactory.cacheInstances.has(policy)) {
      let cacheService: CacheService;

      switch (policy) {
        case CachePolicyEnum.READ_THROUGH:
          cacheService = new CacheService(
            new ReadThroughStrategy(this.redisService),
          );
          break;
        default:
          throw new Error(`Unsupported cache policy: ${policy}`);
      }

      CacheFactory.cacheInstances.set(policy, cacheService);
    }

    return CacheFactory.cacheInstances.get(policy) as CacheService;
  }

  public static getCacheInstance(policy: CachePolicyEnum): CacheService {
    const factory = new CacheFactory();
    return factory.getCache(policy);
  }

  public static getReadThroughCache(): CacheService {
    return this.getCacheInstance(CachePolicyEnum.READ_THROUGH);
  }

  public static getWriteThroughCache(): CacheService {
    return this.getCacheInstance(CachePolicyEnum.WRITE_THROUGH);
  }

  public static getWriteBehindCache(): CacheService {
    return this.getCacheInstance(CachePolicyEnum.WRITE_BEHIND);
  }
}
