import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

const nodeEnv = process.env.NODE_ENV as EnvironmentTypeEnum;
const isProd = nodeEnv === EnvironmentTypeEnum.PROD;

export class QueueEnumHelper {
  static createQueueEnum<T extends Record<string, string>>(enumObj: T): T {
    const transformedEnum: any = {};

    for (const key in enumObj) {
      transformedEnum[key] = isProd
        ? `${enumObj[key]}_LIVE`
        : `${enumObj[key]}_TEST`;
    }

    return transformedEnum as T;
  }
}
