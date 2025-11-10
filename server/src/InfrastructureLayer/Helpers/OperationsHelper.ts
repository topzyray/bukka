export class OperationsHelper {
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    attempts = 3,
    baseDelayMs = 200,
  ): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= attempts) throw err;
        const delay = baseDelayMs * 2 ** (attempt - 1);
        await OperationsHelper.prototype.sleep(
          delay + Math.floor(Math.random() * 100),
        );
      }
    }
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
