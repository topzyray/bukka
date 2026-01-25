import crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { ClientTypeEnum } from 'src/DomainLayer/Enums/ClientTypeEnum';

export type OAuthStatePayload = {
  client: ClientTypeEnum;
  redirectPath: string;
};

export class OAuthHelper {
  private static isValidDeepLink(link: string): boolean {
    // allow only your app schemes
    return link.startsWith('myapp://') || link.startsWith('exp://');
  }

  static extractDeepLinkFromState(state?: string): string | undefined {
    if (!state) return undefined;

    try {
      // base64url decode
      const normalized = state.replaceAll('-', '+').replaceAll('_', '/');
      const json = Buffer.from(normalized, 'base64').toString('utf-8');
      const parsed = JSON.parse(json);

      if (
        parsed?.client === ClientTypeEnum.MOBILE &&
        typeof parsed.deepLink === 'string' &&
        this.isValidDeepLink(parsed.deepLink)
      ) {
        return parsed.deepLink;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  static generateCodeVerifier(length: number = 128): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateCodeChallenge(codeVerifier: string): string {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return this.base64URLEncode(hash);
  }

  private static base64URLEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static encodeState(payload: OAuthStatePayload): string {
    const json = JSON.stringify(payload);
    return Buffer.from(json, 'utf-8').toString('base64');
  }

  static decodeState(rawState: string): OAuthStatePayload {
    try {
      const json = Buffer.from(rawState, 'base64').toString('utf-8');
      const parsed = JSON.parse(json);

      if (!parsed.client || !parsed.redirectPath) {
        throw new BadRequestException('Malformed OAuth state payload');
      }

      return parsed;
    } catch {
      throw new BadRequestException('Invalid OAuth state JSON');
    }
  }

  // Mobile app will generate this and pass it to /auth/google?state=....
  // Keep for mobile app implementation
  static createMobileOAuthState(deepLink: string): string {
    const payload = {
      client: ClientTypeEnum.MOBILE,
      deepLink,
      nonce: crypto.randomUUID(),
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }
}
