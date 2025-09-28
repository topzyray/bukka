export type Direction = 'asc' | 'desc';

export type SortSpec = { field: string; direction?: Direction };

export type Pagination = {
  page?: number;
  pageSize?: number;
  skip?: number;
  limit?: number;
};

export type FieldOp =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export type FilterExpression =
  | { field: string; op: FieldOp; value: any }
  | { AND: FilterExpression[] }
  | { OR: FilterExpression[] }
  | { NOT: FilterExpression };
