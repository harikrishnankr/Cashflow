export const ErrorCode = {
  BAD_REQUEST:           "BAD_REQUEST",
  NOT_FOUND:             "NOT_FOUND",
  UNAUTHORIZED:          "UNAUTHORIZED",
  FORBIDDEN:             "FORBIDDEN",
  CONFLICT:              "CONFLICT",
  VALIDATION_ERROR:      "VALIDATION_ERROR",
  RATE_LIMITED:          "RATE_LIMITED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  INVALID_CREDENTIALS:   "INVALID_CREDENTIALS",
  EMAIL_TAKEN:           "EMAIL_TAKEN",
  USER_NOT_FOUND:        "USER_NOT_FOUND",
  UNKNOWN:               "UNKNOWN",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class BaseError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "Bad request.", code: ErrorCode = ErrorCode.BAD_REQUEST) {
    super(code, message, 400);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "The requested resource was not found.", code: ErrorCode = ErrorCode.NOT_FOUND) {
    super(code, message, 404);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Authentication is required.", code: ErrorCode = ErrorCode.UNAUTHORIZED) {
    super(code, message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "You do not have permission to perform this action.", code: ErrorCode = ErrorCode.FORBIDDEN) {
    super(code, message, 403);
  }
}

export class ConflictError extends BaseError {
  constructor(message = "A conflict occurred with the current state of the resource.", code: ErrorCode = ErrorCode.CONFLICT) {
    super(code, message, 409);
  }
}

export class ValidationError extends BaseError {
  constructor(
    message = "Validation failed.",
    public readonly fields?: Record<string, string>,
    code: ErrorCode = ErrorCode.VALIDATION_ERROR
  ) {
    super(code, message, 422);
  }
}

export class RateLimitedError extends BaseError {
  constructor(message = "Too many attempts. Please try again later.", code: ErrorCode = ErrorCode.RATE_LIMITED) {
    super(code, message, 429);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "An unexpected error occurred.", code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR) {
    super(code, message, 500);
  }
}
