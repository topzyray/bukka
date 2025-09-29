import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

@Injectable()
export class Generator {
  static GenerateToken(tokenLength: number) {
    const characterSet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let token = '';

    if (characterSet) {
      const characterSetLength = characterSet.length;
      for (let i = 0; i < tokenLength; i++) {
        const randomIndex = crypto.randomInt(0, characterSetLength);
        token += characterSet.charAt(randomIndex);
      }
    } else {
      const randomBytes = crypto.randomBytes(tokenLength);
      token = randomBytes.toString('hex');
    }

    return token;
  }

  static GenerateDigits(digitLength: number): number {
    if (digitLength <= 0) {
      throw new Error(
        'Invalid digit length. Please provide a positive number.',
      );
    }
    const min = Math.pow(10, digitLength - 1);
    const max = Math.pow(10, digitLength) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static GenerateSecurePassword(): string {
    const passwordLength = 10;
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digitChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars =
      lowerCaseChars + upperCaseChars + digitChars + specialChars;

    let password = '';
    password += lowerCaseChars.charAt(
      crypto.randomInt(0, lowerCaseChars.length),
    );
    password += upperCaseChars.charAt(
      crypto.randomInt(0, upperCaseChars.length),
    );
    password += digitChars.charAt(crypto.randomInt(0, digitChars.length));
    password += specialChars.charAt(crypto.randomInt(0, specialChars.length));

    const remainingLength = passwordLength - 4;
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = crypto.randomInt(0, allChars.length);
      password += allChars.charAt(randomIndex);
    }

    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    return password;
  }

  // Hashing function from bcrypt
  static async hash(data: string, saltRounds: number): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }

  static calculateExpirationTime(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  static generateRandomString(length = 32): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
