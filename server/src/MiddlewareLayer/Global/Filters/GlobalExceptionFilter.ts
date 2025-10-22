import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor() {}
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      details = exception.stack || exception.message;
    } else if (exception instanceof Error) {
      details = exception.stack || exception.message;
      message = exception.message;
    } else {
      details = JSON.stringify(exception);
    }

    const majorException = details.split('\n')[0];
    const authUser = await InMemoryCacheService.getFromInMemory('authUser');

    const logEntry = {
      exceptionDate: new Date().toISOString(),
      userId: authUser?.userId ?? '000',
      method: request.method.toString(),
      url: request.url,
      status,
      details: majorException,
      metaData: details,
    };

    this.logger.error({
      status: false,
      responseCode: status,
      errorDetails: details,
    });

    response.status(status).json(BukkaResponse.ErrorResponse(message, status));
  }
}
