export interface PaginationInput {
  page: number;
  limit: number;
}

export interface PaginatedOutput<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
