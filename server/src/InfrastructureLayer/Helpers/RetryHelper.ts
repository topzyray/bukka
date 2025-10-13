import { Logger } from '@nestjs/common';

export class RetryHelper {
  static readonly logger = new Logger(RetryHelper.name);
  /**
   * Retry a given async operation with exponential backoff.
   * @param fn - The async function to retry.
   * @param maxAttempts - Maximum number of attempts (default: 3).
   * @param baseDelayMs - Base delay in milliseconds (default: 200ms).
   */
  static async withExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    baseDelayMs = 200,
  ): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        this.logger.log(`Retry Attempt: ${attempt}`);
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= maxAttempts) throw err;

        const backoff = baseDelayMs * 2 ** (attempt - 1);
        const jitter = Math.floor(Math.random() * 100);
        const delay = backoff + jitter;

        await this.sleep(delay);
      }
    }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
