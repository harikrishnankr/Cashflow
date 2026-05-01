export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type PaginatedResponse<T> = ApiSuccess<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>;
