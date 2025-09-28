export interface IExceptionLog {
  userId: string;
  exceptionDate: string;
  method?: string;
  url?: string;
  status?: number;
  details?: any;
  metaData?: any;
}
