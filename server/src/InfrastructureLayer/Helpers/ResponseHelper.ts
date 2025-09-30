export class ResponseHelper {
  static handleResponseWithCount<T extends { count: number }>(
    result: T,
  ): T | null {
    return result.count > 0 ? result : null;
  }
}
