import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum([EnvironmentTypeEnum.DEV, EnvironmentTypeEnum.PROD]),
  // PORT: z.string().min(1),
  // DATABASE_URL: z.string().min(1),
  // SSL_KEY_PATH: z.string().min(1),
  // SSL_CERT_PATH: z.string().min(1),
  // SMS_PROVIDER: z.string().min(1),
  // EMAIL_PROVIDER: z.string().min(1),
  // EMAIL_TEMPLATE_ENGINE: z.string().min(1),
  // SENDER_EMAIL: z.string().min(1),
  // FILE_PROVIDER: z.string().min(1),
  // QUEUE_PROVIDER: z.string().min(1),
  // REDIS_HOST: z.string().min(1),
  // REDIS_PORT: z.string().min(1),
  // REDIS_PASSWORD: z.string().min(1),
});

export type AppConfig = z.infer<typeof configSchema>;
