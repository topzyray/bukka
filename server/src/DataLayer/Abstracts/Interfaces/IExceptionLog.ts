export interface IExceptionLog {
  userId: number;
  exceptionDate: string;
  method?: string;
  url?: string;
  status?: number;
  details?: any;
  metaData?: any;
}
