import { Injectable, NestMiddleware } from '@nestjs/common';
import { MicroserviceType } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
  ProcessSystemEventLogDto,
  ProcessUserActivityLogDto,
} from 'src/DomainLayer/Dtos/AuditLogDto';
import { AuditStatusEnum } from 'src/DomainLayer/Enums/AuditStatusEnum';
import { MicroserviceTypeEnum } from 'src/DomainLayer/Enums/MicroserviceTypeEnum';
import { OptionalUserEnum } from 'src/DomainLayer/Enums/OptionalUserEnum';
import { ResourceTypeEnum } from 'src/DomainLayer/Enums/ResourceTypeEnum';
import { AuditLogHelper } from 'src/InfrastructureLayer/Helpers/AuditLogHelper';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  constructor(private readonly auditLogHelper: AuditLogHelper) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, ip, headers, body, query } = req;
    const userAgent = headers['user-agent'] ?? 'Unknown';

    const isSystemGenerated = req.headers['x-system-activity'] === 'true';

    const authUser = await InMemoryCacheService.getFromInMemory('authUser');

    const userId =
      authUser?.userId ??
      (isSystemGenerated ? OptionalUserEnum.SYSTEM : OptionalUserEnum.UNKNOWN);

    const serviceType = req.headers['x-service-type'] as MicroserviceType;

    res.on('finish', async () => {
      try {
        const { statusCode, statusMessage } = res;

        const logData: ProcessSystemEventLogDto | ProcessUserActivityLogDto = {
          userId,
          action: `Request ${method} ${url}`,
          method,
          url,
          details: {
            requestBody: this.sanitizeRequestBody(body),
            queryParams: query,
            headers,
          },
          userAgent,
          ipAddress: ip as string,
          request: body,
          response: {
            statusCode,
            statusMessage,
          },
          resourceType: isSystemGenerated
            ? ResourceTypeEnum.SYSTEM_ACTIVITY
            : ResourceTypeEnum.API_REQUEST,
          status:
            statusCode >= 400
              ? AuditStatusEnum.FAILED
              : AuditStatusEnum.SUCCESS,
          serviceType: serviceType ?? MicroserviceTypeEnum.TASK360,
        };

        if (isSystemGenerated) {
          await this.auditLogHelper.processSystemEventLog(logData);
        } else {
          await this.auditLogHelper.processUserActivityLog(logData);
        }
      } catch (error) {
        console.error('Failed to log audit data:', error);
      }
    });

    next();
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return {};
    const sanitizedBody = { ...body };
    delete sanitizedBody.password;
    delete sanitizedBody.token;
    return sanitizedBody;
  }
}
