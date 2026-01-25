import { ClientTypeEnum } from "@/enums/ClientTypeEnum";
import crypto from "crypto";

export type OAuthStatePayload = {
  client: ClientTypeEnum;
  redirectPath: string;
};

export class OAuthHelper {
  static generateCodeVerifier(length: number = 128): string {
    return crypto.randomBytes(length).toString("hex");
  }

  static generateCodeChallenge(codeVerifier: string): string {
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    return this.base64URLEncode(hash);
  }

  private static base64URLEncode(buffer: Buffer): string {
    return buffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  static encodeState(payload: OAuthStatePayload): string {
    const json = JSON.stringify(payload);
    return Buffer.from(json, "utf-8").toString("base64");
  }
}
