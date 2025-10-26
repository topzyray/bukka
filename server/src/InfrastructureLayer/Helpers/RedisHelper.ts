import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisHelper {
  static generateCacheKey = <T extends Record<string, unknown>>(
    prefix: string,
    params: T,
  ): string => {
    const sortedParams = Object.keys(params)
      .sort((a, b) => a.localeCompare(b))
      .reduce(
        (acc, key) => {
          acc[key] = params[key];
          return acc;
        },
        {} as Record<string, unknown>,
      );

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  };
}
