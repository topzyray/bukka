export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  data: T;
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
  id?: string | number | string[] | number[];
  [key: string]: any; // allow additional params if needed
}

export interface BukkaResponse<T> {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: T;
}
