import { UnauthorizedError, NotFoundError, ConflictError, ErrorCode } from "@/lib/errors";

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super("Invalid email or password.", ErrorCode.INVALID_CREDENTIALS);
  }
}

export class AuthUserNotFoundError extends NotFoundError {
  constructor() {
    super("No account found with that email.", ErrorCode.USER_NOT_FOUND);
  }
}

export class EmailTakenError extends ConflictError {
  constructor() {
    super("An account with this email already exists.", ErrorCode.EMAIL_TAKEN);
  }
}
