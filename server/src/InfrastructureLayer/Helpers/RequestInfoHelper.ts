import { Request } from 'express';

export class RequestInfoHelper {
  static getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'Unknown'
    );
  }

  static getUserAgent(req: Request): string {
    return req.headers['user-agent'] || 'Unknown';
  }
}
