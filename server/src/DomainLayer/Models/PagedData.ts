export class PagedData<T> {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  data: T;

  constructor() {
    this.page = 0;
    this.pageSize = 0;
    this.total = 0;
    this.pageCount = 0;
    this.data = null as T;
  }
}
