export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403, "FORBIDDEN");
  }
}

export class TenantIsolationError extends AppError {
  constructor(message = "Access to the requested tenant resource is denied") {
    super(message, 403, "TENANT_ACCESS_DENIED");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource", identifier?: string) {
    const msg = identifier ? `${resource} (${identifier}) not found` : `${resource} not found`;
    super(msg, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}
