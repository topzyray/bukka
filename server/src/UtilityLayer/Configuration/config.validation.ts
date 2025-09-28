import { Logger } from '@nestjs/common';
import { configSchema, AppConfig } from './config.schema';

const logger = new Logger();

export function validateConfig(config: Record<string, unknown>): AppConfig {
  const parsed = configSchema.safeParse(config);

  if (!parsed.success) {
    for (const [key, value] of Object.entries(parsed.error.format())) {
      if ('_errors' in value && value._errors.length > 0) {
        logger.error(`${key}: ${value._errors.join(', ')}`);
      }
    }

    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}
