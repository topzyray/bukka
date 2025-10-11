export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  data: T;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchParams?: string;
  id?: string | number | string[] | number[];
  [key: string]: any; // allow additional params if needed
}

export interface BukkaResponse<T> {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: PagedResponse<T>;
}
