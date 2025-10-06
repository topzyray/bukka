import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const user = basicAuth(req);

    const validUser = process.env.SWAGGER_USERNAME;
    const encryptedPass = process.env.SWAGGER_ENCRYPTED_PASSWORD as string;

    if (!user || !user.name || !user.pass) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"');
      return res.status(401).send('Missing authentication credentials');
    }

    const isValid =
      user.name === validUser &&
      (await ValidationHelper.validatePassword(user.pass, encryptedPass));

    if (!isValid) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"');
      return res.status(401).send('Invalid authentication credentials');
    }

    return next();
  }
}
