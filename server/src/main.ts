import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';
import {
  HttpStatus,
  Logger,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './MiddlewareLayer/Global/Filters/GlobalExceptionFilter';
import { EnvironmentTypeEnum } from './DomainLayer/Enums/EnvironmentTypeEnum';
import { BasicAuthMiddleware } from './MiddlewareLayer/Global/Middlewares/BasicAuthMiddleware';
import { AppUrlTypeEnum } from './DomainLayer/Enums/AppUrlTypeEnum';
import { TokenTypeEnum } from './DomainLayer/Enums/TokenTypeEnum';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const isProd =
    process.env.NODE_ENV?.toLowerCase() ===
    EnvironmentTypeEnum.PROD.toLowerCase();
  let httpsOptions: NestApplicationOptions['httpsOptions'] = undefined;
  let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8006;

  if (isProd && !process.env.PORT) {
    port = 8000;
  }

  if (isProd && process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
  }

  const app = await NestFactory.create(
    AppModule,
    httpsOptions ? { httpsOptions } : {},
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use('/.well-known', (_req: Request, res: Response) => {
    res.status(HttpStatus.NO_CONTENT).send();
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: [`${AppUrlTypeEnum.LOCAL}:3000`, AppUrlTypeEnum.PROD],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  });
  app.use(helmet());

  app.use(['/swagger'], (req: Request, res: Response, next: NextFunction) => {
    const basicAuthMiddleware = new BasicAuthMiddleware();
    basicAuthMiddleware.use(req, res, next);
  });

  const config = new DocumentBuilder()
    .setTitle('Bukka Server')
    .setDescription('Bukka Server APIs')
    .setVersion('v1')
    .setExternalDoc('API Schema', '/swagger/v1/swagger.json')
    // .addBasicAuth({ type: 'http', scheme: 'basic' }, 'swagger-auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      TokenTypeEnum.ACCESS_TOKEN,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      // persistAuthorization: true,
    },
  });

  app.use('/swagger/v1/swagger.json', (_req: Request, res: Response) => {
    res.json(document);
  });

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Server running on ${port}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed: ', err);
  process.exit(1);
});
