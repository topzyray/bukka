import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum([EnvironmentTypeEnum.DEV, EnvironmentTypeEnum.PROD], {
    error: 'NODE_ENV is required (must be "development" or "production")',
  }),
  DATABASE_URL: z
    .string({ error: 'DATABASE_URL is required' })
    .min(
      1,
      'DATABASE_URL cannot be empty — used by Prisma to connect to your DB',
    ),

  GOOGLE_MAPS_API_KEY: z
    .string({ error: 'GOOGLE_MAPS_API_KEY is required' })
    .min(1, 'Google Maps API key must be provided'),

  TOKEN_SECRET: z
    .string({ error: 'TOKEN_SECRET is required' })
    .min(32, 'TOKEN_SECRET must be at least 32 characters long'),

  TOKEN_EXPIRY_IN_SECONDS: z
    .string({ error: 'TOKEN_EXPIRY_IN_SECONDS is required' })
    .min(1, 'Specify how long tokens should last (in seconds)'),

  PORT: z.string().optional(),

  SSL_KEY_PATH: z
    .string()
    .optional()
    .describe('Path to SSL key file (used only in production with HTTPS)'),

  SSL_CERT_PATH: z
    .string()
    .optional()
    .describe('Path to SSL cert file (used only in production with HTTPS)'),

  SMS_PROVIDER: z
    .string({ error: 'SMS_PROVIDER is required' })
    .min(1, 'Specify the SMS provider (e.g., twilio, africastalking)'),

  EMAIL_PROVIDER: z
    .string({ error: 'EMAIL_PROVIDER is required' })
    .min(1, 'Specify the email provider (e.g., gmail, sendgrid)'),

  EMAIL_HOST: z
    .string({ error: 'EMAIL_HOST is required' })
    .min(1, 'Specify the SMTP host for sending emails'),

  EMAIL_TEMPLATE_ENGINE: z
    .string({ error: 'EMAIL_TEMPLATE_ENGINE is required' })
    .min(1, 'Specify the template engine (e.g., handlebars, pug, ejs)'),

  SENDER_EMAIL: z
    .string({ error: 'SENDER_EMAIL is required' })
    .min(1, 'Provide the email address that sends system messages'),

  SENDER_PASSWORD: z
    .string({ error: 'SENDER_PASSWORD is required' })
    .min(1, 'Provide the sender email password or app key'),

  FILE_PROVIDER: z
    .string({ error: 'FILE_PROVIDER is required' })
    .min(1, 'Specify the file provider (e.g., s3, cloudinary, local)'),

  QUEUE_PROVIDER: z
    .string({ error: 'QUEUE_PROVIDER is required' })
    .min(1, 'Specify the queue provider (e.g., bull, redis, rabbitmq)'),

  // REDIS_HOST: z
  //   .string({ error: 'REDIS_HOST is required' })
  //   .min(1, 'Redis host is required for caching/queues'),

  // REDIS_PORT: z
  //   .string({ error: 'REDIS_PORT is required' })
  //   .min(1, 'Redis port is required'),

  // REDIS_PASSWORD: z
  //   .string({ error: 'REDIS_PASSWORD is required' })
  //   .min(1, 'Redis password is required'),
});

export type AppConfig = z.infer<typeof configSchema>;
