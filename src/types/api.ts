// =============================================================================
// API Types — Standard response wrappers and error shapes
// =============================================================================

/** Standard Codex API response wrapper */
export interface CodexResponse<T> {
  success: boolean;
  data: T;
}

/** Codex list response with items */
export interface CodexListResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total?: number;
  };
}

/** Standard API error response */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/** Paginated request params */
export interface PaginationParams {
  offset?: number;
  limit?: number;
}

/** API response with caching metadata */
export interface CachedApiResponse<T> {
  data: T;
  cached: boolean;
  timestamp: number;
}
