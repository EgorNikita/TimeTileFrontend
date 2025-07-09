export interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PagedListParams<T> {
  entity?: T;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
}
