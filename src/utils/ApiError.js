
class ApiError extends Error {
  constructor(message, statusCode, errorCode = 'ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details = null) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR');
    this.isOperational = false;
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError,
};
