import { NotFoundError } from "@/helpers/error-handler";
import CryptoJS from "crypto-js";

export class TokenEncryptionHelper {
  private static SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

  static encryptToken(token: string): string {
    if (!TokenEncryptionHelper.SECRET_KEY) {
      throw new NotFoundError("SECRET_KEY is not defined");
    }
    return CryptoJS.AES.encrypt(token, TokenEncryptionHelper.SECRET_KEY).toString();
  }

  static decryptToken(encryptedToken: string): string | null {
    if (!TokenEncryptionHelper.SECRET_KEY) {
      throw new NotFoundError("SECRET_KEY is not defined");
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, TokenEncryptionHelper.SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData || null;
    } catch (e) {
      console.error("Error decrypting token", e);
      return null;
    }
  }
}
