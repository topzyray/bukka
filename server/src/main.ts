import * as fs from 'fs';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './MiddlewareLayer/Global/Filters/GlobalExceptionFilter';
import { EnvironmentTypeEnum } from './DomainLayer/Enums/EnvironmentTypeEnum';

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
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Bukka Server')
    .setDescription('Bukka Server APIs')
    .setVersion('v1')
    .setExternalDoc('API Schema', '/swagger/v1/swagger.json')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      url: '/swagger/v1/swagger.json',
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
