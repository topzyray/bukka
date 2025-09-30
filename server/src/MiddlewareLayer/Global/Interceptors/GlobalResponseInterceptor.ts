import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const httpCtx = context.switchToHttp();
    const res = httpCtx.getResponse<Response>();

    const handler = context.getHandler().name;
    const className = context.getClass().name.replace('Controller', '');
    const entityName = className;

    return next.handle().pipe(
      map((data) => {
        // If already formatted as BukkaResponse, skip
        if (this.isOwoResponse(data)) {
          return data;
        }

        let response: any;

        const isPaged =
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'total' in data &&
          ('pageNumber' in data || 'page' in data) &&
          'pageSize' in data;

        if (handler.toLowerCase().startsWith('create')) {
          response = BukkaResponse.createResponse(entityName, data);
        } else if (handler.toLowerCase().startsWith('update')) {
          response = BukkaResponse.updateResponse(entityName, data);
        } else if (handler.toLowerCase().startsWith('delete')) {
          response = BukkaResponse.deleteResponse(
            entityName,
            !!data,
            undefined,
            data,
          );
        } else if (isPaged) {
          response = BukkaResponse.GetPagedDataResponse(entityName, data);
        } else if (Array.isArray(data)) {
          response = BukkaResponse.GetListDataResponse(entityName, data);
        } else {
          response = BukkaResponse.GetSingleDataResponse(entityName, data);
        }

        res.status(response.responseCode);
        return response;
      }),
    );
  }

  private isOwoResponse(obj: any): obj is BukkaResponse<any> {
    return (
      obj &&
      typeof obj === 'object' &&
      'responseCode' in obj &&
      'responseMessage' in obj
    );
  }
}
