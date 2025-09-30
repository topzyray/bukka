import { ApiEndpointEnum } from 'src/DomainLayer/Enums/ApiEndpointEnum';

export class GenericHelper {
  static isUrlMatchingEndpoint(
    url: string,
    endpointEnum: ApiEndpointEnum,
    endpointLists: { [key in ApiEndpointEnum]: string[] },
  ): boolean {
    const endpoints = endpointLists[endpointEnum];
    return endpoints && endpoints.some((endpoint) => url.includes(endpoint));
  }

  static utf8ToBase64(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }),
    );
  }
  static invertObject(obj: { [key: string]: string }): {
    [key: string]: string;
  } {
    const invertedObj: { [key: string]: string } = {};
    Object.entries(obj).forEach(([key, value]) => {
      invertedObj[value] = key;
    });
    return invertedObj;
  }

  static randomArrayItem<T>(data: T[]) {
    return data[Math.random() * data.length - 1];
  }
}
