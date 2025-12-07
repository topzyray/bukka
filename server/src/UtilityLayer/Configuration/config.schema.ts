import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum([EnvironmentTypeEnum.DEV, EnvironmentTypeEnum.PROD], {
    error: 'NODE_ENV is required (must be "development" or "production")',
  }),

  APP_URL: z
    .string({ error: 'APP_URL is required' })
    .min(1, 'APP_URL cannot be empty — used by Cron to keep app alive'),

  DATABASE_URL: z
    .string({ error: 'DATABASE_URL is required' })
    .min(
      1,
      'DATABASE_URL cannot be empty — used by Prisma to connect to your DB',
    ),

  SUPPORT_EMAIL: z
    .string({ error: 'SUPPORT_EMAIL is required' })
    .min(1, 'SUPPORT_EMAIL cannot be empty'),

  REDIS_URL: z
    .string({ error: 'REDIS_URL is required' })
    .min(1, 'REDIS_URL cannot be empty — used by connecting to Redis'),

  GOOGLE_MAPS_API_KEY: z
    .string({ error: 'GOOGLE_MAPS_API_KEY is required' })
    .min(1, 'Google Maps API key must be provided'),

  LOCATIONIQ_ACCESS_TOKEN: z
    .string({ error: 'LOCATIONIQ_ACCESS_TOKEN is required' })
    .min(1, 'LocationIQ Access Token must be provided'),

  GEOAPIFY_KEY: z
    .string({ error: 'GEOAPIFY_KEY is required' })
    .min(1, 'GeoAPIFY must be provided'),

  TOKEN_SECRET: z
    .string({ error: 'TOKEN_SECRET is required' })
    .min(32, 'TOKEN_SECRET must be at least 32 characters long'),

  ACCESS_TOKEN_MAX_AGE: z
    .string({ error: 'ACCESS_TOKEN_MAX_AGE is required' })
    .min(4, 'ACCESS_TOKEN_MAX_AGE must be at least resonable amount of time'),

  REFRESH_TOKEN_MAX_AGE: z
    .string({ error: 'REFRESH_TOKEN_MAX_AGE is required' })
    .min(6, 'REFRESH_TOKEN_MAX_AGE must be at least resonable amount of time'),

  ENCRYPTION_KEY: z
    .string({ error: 'ENCRYPTION_KEY is required' })
    .regex(/^[a-fA-F0-9]+$/, 'ENCRYPTION_KEY must be a valid hex string')
    .length(64, 'ENCRYPTION_KEY must be 64 hex characters (32 bytes)'),

  ENCRYPTION_IV: z
    .string({ error: 'ENCRYPTION_IV is required' })
    .regex(/^[a-fA-F0-9]+$/, 'ENCRYPTION_IV must be a valid hex string')
    .length(32, 'ENCRYPTION_IV must be 32 hex characters (16 bytes)'),

  ENCRYPTION_ALGORITHM: z
    .string()
    .default('aes-256-cbc')
    .refine((val) => val === 'aes-256-cbc', 'Only aes-256-cbc is supported'),

  TOKEN_EXPIRY_IN_SECONDS: z
    .string({ error: 'TOKEN_EXPIRY_IN_SECONDS is required' })
    .min(1, 'Specify how long tokens should last (in seconds)'),

  MAX_SESSION_COUNT: z
    .string({ error: 'MAX_SESSION_COUNT is required' })
    .min(1, 'Specify the maximum session a user can have'),

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

  EMAIL_HOST: z.string().optional().describe('Email host for Nodemailer'),

  EMAIL_TEMPLATE_ENGINE: z
    .string({ error: 'EMAIL_TEMPLATE_ENGINE is required' })
    .min(1, 'Specify the template engine (e.g., handlebars, pug, ejs)'),

  EMAIL_TEMPLATES_DIR: z
    .string({ error: 'EMAIL_TEMPLATES_DIR is required' })
    .min(1, 'Specify the template directory'),

  SENDER_EMAIL: z
    .string({ error: 'SENDER_EMAIL is required' })
    .min(1, 'Provide the email address that sends system messages'),

  SENDER_NAME: z
    .string({ error: 'SENDER_NAME is required' })
    .min(1, 'Provide the sender name that sends system emails'),

  SENDER_PASSWORD: z
    .string()
    .optional()
    .describe('Email sender password for Nodemailer'),

  MAILJET_API_KEY: z.string().optional().describe('MailJet API Key'),

  MAILJET_SECRET_KEY: z.string().optional().describe('MailJet Secret Key'),

  MAILGUN_API_KEY: z.string().optional().describe('MailGun API Key'),

  MAILGUN_DOMAIN: z.string().optional().describe('MailGun Domain'),

  FILE_PROVIDER: z
    .string({ error: 'FILE_PROVIDER is required' })
    .min(1, 'Specify the file provider (e.g., s3, cloudinary, local)'),

  FILE_UPLOAD_TIMEOUT: z
    .string({ error: 'FILE_UPLOAD_TIMEOUT is required' })
    .min(
      1,
      'Specify the file upload time use for retries incase of failed upload',
    ),

  CLOUDINARY_CLOUD_NAME: z
    .string({ error: 'CLOUDINARY_CLOUD_NAME is required' })
    .min(1, 'Specify the cloudinary cloud name'),

  CLOUDINARY_API_KEY: z
    .string({ error: 'CLOUDINARY_API_KEY is required' })
    .min(1, 'Specify the cloudinary cloud api key'),

  CLOUDINARY_API_SECRET: z
    .string({ error: 'CLOUDINARY_API_SECRET is required' })
    .min(1, 'Specify the cloudinary cloud key'),

  CLOUDINARY_FOLDER: z
    .string({ error: 'CLOUDINARY_FOLDER is required' })
    .min(1, 'Specify the cloudinary cloud folder'),

  SWAGGER_USERNAME: z
    .string({ error: 'SWAGGER_USERNAME is required' })
    .min(1, 'Specify the swagger username for API authentication'),

  SWAGGER_ENCRYPTED_PASSWORD: z
    .string({ error: 'SWAGGER_ENCRYPTED_PASSWORD is required' })
    .min(1, 'Specify the swagger username for API authentication'),

  SWAGGER_PASSWORD: z
    .string({ error: 'SWAGGER_PASSWORD is required' })
    .min(1, 'Specify the swagger username for API authentication'),

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
