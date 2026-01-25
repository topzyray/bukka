import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SocialAccountProviderEnum } from 'src/DomainLayer/Enums/SocialAccountProviderEnum';
import { OAuthHelper } from 'src/InfrastructureLayer/Helpers/OAuthHelper';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(
  SocialAccountProviderEnum.GOOGLE,
) {
  getAuthenticateOptions(context: ExecutionContext): {
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
  } {
    const req = context.switchToHttp().getRequest<Request>();

    const rawStateAny = req.query.state;

    if (Array.isArray(rawStateAny))
      throw new BadRequestException('Invalid OAuth state');

    if (typeof rawStateAny === 'string' && rawStateAny.length > 512)
      throw new BadRequestException('OAuth state too large');

    const state: string | undefined =
      typeof rawStateAny === 'string' ? rawStateAny : undefined;

    if (state) OAuthHelper.decodeState(state); // validate

    const codeChallenge =
      typeof req.query.code_challenge === 'string'
        ? req.query.code_challenge
        : undefined;
    const codeChallengeMethod =
      typeof req.query.code_challenge_method === 'string'
        ? req.query.code_challenge_method
        : undefined;

    return {
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    };
  }
}
