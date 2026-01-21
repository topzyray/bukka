import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SocialAccountProviderEnum } from 'src/DomainLayer/Enums/SocialAccountProviderEnum';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(
  SocialAccountProviderEnum.GOOGLE,
) {}
