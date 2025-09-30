import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class BukkaResponse<K> {
  static SetHeaderData(key: string, data: any, res: Response): void {
    if (key && data) {
      res.set(key, JSON.stringify(data));
    }
  }

  static GetStatusResponse<T>(response: BukkaResponse<T>, res: Response): void {
    res.status(response.responseCode).send(response);
  }

  static finishCallbackResponse(
    response: BukkaResponse<any>,
    res: Response,
    callback: () => any,
  ): void {
    res.once('finish', () => callback);
    BukkaResponse.GetStatusResponse(response, res);
  }

  static closeCallbackResponse(
    response: BukkaResponse<any>,
    res: Response,
    callback: () => any,
  ): void {
    res.once('close', () => callback);
    BukkaResponse.GetStatusResponse(response, res);
  }

  static createResponse<T>(entityName: string, data?: T, message?: string) {
    return {
      status: !!data,
      responseCode: data ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (data
          ? `${entityName} successfully created.`
          : `Failed to create ${entityName}.`),
      responseData: data ?? null,
    };
  }

  static createMultipleResponse<T>(
    entityName: string,
    data: T[] = [],
    count: number = 0,
    message?: string,
  ) {
    return {
      status: data.length > 0,
      responseCode:
        data.length > 0 ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (data.length > 0 || count > 0
          ? `${entityName}s successfully created.`
          : `Failed to create ${entityName}s.`),
      responseData: data.length > 0 ? data : null,
    };
  }

  static verifyResponse<T>(entityName: string, data?: T, message?: string) {
    return {
      status: !!data,
      responseCode: data ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (data
          ? `${entityName} successfully verified.`
          : `Failed to verify ${entityName}.`),
      responseData: data ?? null,
    };
  }

  static UnAuthorizedResponse(message?: string) {
    return {
      status: false,
      responseCode: HttpStatus.UNAUTHORIZED,
      responseMessage:
        message || `You are Unauthorized, Please provide a valid access token`,
    };
  }

  static conflictResponse(entityName: string, message?: string) {
    return {
      status: false,
      responseCode: HttpStatus.CONFLICT,
      responseMessage: message || `User with ${entityName} already exists.`,
    };
  }

  static GetSingleDataResponse<T>(
    entityName: string,
    data?: T,
    message?: string,
    code?: number,
  ) {
    return {
      status: !!data,
      responseCode: data ? HttpStatus.OK : code || HttpStatus.NOT_FOUND,
      responseMessage:
        message ||
        (data
          ? `${entityName} successfully retrieved.`
          : `${entityName} not found.`),
      responseData: data ?? null,
    };
  }

  static GetListDataResponse<T>(
    entityName: string,
    data?: T[],
    message?: string,
  ) {
    return {
      status: !!(data && data.length > 0),
      responseCode:
        data && data.length > 0 ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      responseMessage:
        message ||
        (data && data.length > 0
          ? `${entityName}s successfully retrieved.`
          : `${entityName}s not found.`),
      responseData: data ?? null,
    };
  }

  static GetPagedDataResponse<T>(
    entityName: string,
    data?: T,
    message?: string,
  ) {
    return {
      status: !!data,
      responseCode: data ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      responseMessage:
        message ||
        (data
          ? `${entityName} successfully retrieved.`
          : `${entityName} not found.`),
      responseData: data ?? null,
    };
  }

  static updateResponse<T>(entityName: string, data?: T, message?: string) {
    return {
      status: !!data,
      responseCode: data ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (data
          ? `${entityName} successfully updated.`
          : `Failed to update ${entityName}.`),
      responseData: data ?? null,
    };
  }

  static deleteResponse(
    entityName: string,
    isDeleted: boolean,
    message?: string,
    data?: unknown,
  ) {
    return {
      status: isDeleted,
      responseCode: isDeleted ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (isDeleted
          ? `${entityName} successfully deleted.`
          : `Failed to delete ${entityName}.`),
      responseData: data ?? null,
    };
  }

  static errorResponse(message: string, code?: HttpStatus) {
    return {
      status: false,
      responseCode: code ?? HttpStatus.INTERNAL_SERVER_ERROR,
      responseMessage: message,
      responseData: null,
    };
  }

  static badRequestResponse(message: string, code?: HttpStatus) {
    return {
      status: false,
      responseCode: code ?? HttpStatus.BAD_REQUEST,
      responseMessage: message,
      responseData: null,
    };
  }

  static loginResponse<T>(
    entity: string,
    data?: T,
    success?: boolean,
    message?: string,
  ) {
    return {
      status: !!success,
      responseCode: success ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      responseMessage:
        message ||
        (success
          ? `${entity} logged in successfully`
          : `${entity} login failed`),
      responseData: success ? data : null,
    };
  }

  static customResponse(
    message?: string,
    status?: number,
    success?: boolean,
    data?: object | null,
  ) {
    return {
      status: success ?? false,
      responseCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      responseMessage: message || 'Bukka API',
      responseData: data ?? null,
    };
  }
  id?: number;

  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData?: any;
}
