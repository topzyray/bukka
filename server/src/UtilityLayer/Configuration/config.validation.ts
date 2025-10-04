import { Logger } from '@nestjs/common';
import { configSchema, AppConfig } from './config.schema';
import chalk from 'chalk';

const logger = new Logger('ConfigValidation');

export function validateConfig(config: Record<string, unknown>): AppConfig {
  const parsed = configSchema.safeParse(config);

  if (!parsed.success) {
    for (const [key, value] of Object.entries(parsed.error.format())) {
      if ('_errors' in value && value._errors.length > 0) {
        const errorMessages = value._errors.join(', ');
        logger.error(chalk.yellow(`  - ${key}: ${errorMessages}`));
      }
    }

    throw new Error('Invalid environment configuration');
  }

  logger.log(chalk.green('Environment configuration validated successfully!'));
  return parsed.data;
}
