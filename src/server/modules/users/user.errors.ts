import { NotFoundError, ForbiddenError, ErrorCode } from "@/lib/errors";

export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`User "${id}" not found.`, ErrorCode.USER_NOT_FOUND);
  }
}

export { ForbiddenError };
