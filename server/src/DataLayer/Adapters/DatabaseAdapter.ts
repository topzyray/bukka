import {
  FilterExpression,
  Pagination,
  SortSpec,
} from '../Abstracts/Types/DatabaseTypes';

export interface QuerySpec {
  filter?: FilterExpression | Record<string, any>;
  sort?: SortSpec[];
  relations?: string[]; // include/populate relations by name
  select?: string[]; // projection
  pagination?: Pagination;
  extras?: any; // escape-hatch for adapter-specific options
}

export interface ModelProxy<T = any> {
  insert(doc: Partial<T>): Promise<T>;
  find(spec?: QuerySpec): Promise<T[]>;
  findOne(spec?: QuerySpec): Promise<T | null>;
  updateOne(spec: QuerySpec, update: Partial<T>): Promise<T | null>;
  updateMany(spec: QuerySpec, update: Partial<T>): Promise<{ count: number }>;
  deleteOne(spec: QuerySpec): Promise<void>;
  deleteMany(spec: QuerySpec): Promise<{ count: number }>;
  count(spec?: QuerySpec): Promise<number>;
  aggregate?(pipeline: any[]): Promise<any>;
}

export interface IDatabaseAdapter {
  connect?(): Promise<void>;
  getModel<T = any>(name: string): ModelProxy<T>;
  transaction?<R>(fn: (txAdapter: IDatabaseAdapter) => Promise<R>): Promise<R>;
  raw?(q: string, params?: any[]): Promise<any>;
  close?(): Promise<void>;
}
