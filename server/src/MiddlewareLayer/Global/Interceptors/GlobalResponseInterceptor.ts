import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { OwoResponse } from 'src/DomainLayer/Models/BukkaResponse';

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
        // If already formatted as OwoResponse, skip
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
          response = OwoResponse.createResponse(entityName, data);
        } else if (handler.toLowerCase().startsWith('update')) {
          response = OwoResponse.updateResponse(entityName, data);
        } else if (handler.toLowerCase().startsWith('delete')) {
          response = OwoResponse.deleteResponse(
            entityName,
            !!data,
            undefined,
            data,
          );
        } else if (isPaged) {
          response = OwoResponse.GetPagedDataResponse(entityName, data);
        } else if (Array.isArray(data)) {
          response = OwoResponse.GetListDataResponse(entityName, data);
        } else {
          response = OwoResponse.GetSingleDataResponse(entityName, data);
        }

        res.status(response.responseCode);
        return response;
      }),
    );
  }

  private isOwoResponse(obj: any): obj is OwoResponse<any> {
    return (
      obj &&
      typeof obj === 'object' &&
      'responseCode' in obj &&
      'responseMessage' in obj
    );
  }
}
