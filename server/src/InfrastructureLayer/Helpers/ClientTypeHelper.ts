import type { Request } from 'express';
import { ClientTypeEnum } from 'src/DomainLayer/Enums/ClientTypeEnum';

export class ClientTypeHelper {
  static getClientType(req: Request): ClientTypeEnum {
    const header = (req.headers['x-client-type'] || '')
      .toString()
      .toLowerCase();
    if (header === 'mobile' || header === 'native' || header === 'expo')
      return ClientTypeEnum.MOBILE;
    return ClientTypeEnum.WEB;
  }

  static getRefreshTokenFromRequest(req: Request): string | undefined {
    const bodyToken = req.body?.refreshToken;
    const authHeaderToken = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : undefined;
    return req.cookies?.refreshToken || bodyToken || authHeaderToken;
  }
}
