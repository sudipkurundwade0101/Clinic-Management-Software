export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode = 500, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", errors?: any[]) {
    super(message, 400, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors?: any[]) {
    super(message, 422, errors);
  }
}
