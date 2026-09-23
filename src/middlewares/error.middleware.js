const { ApiError, NotFoundError, ConflictError, ValidationError } = require('../utils/ApiError');
const { env } = require('../config/env');

// Catches requests to routes that don't exist at all.
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Translates known "raw" error types (Mongoose, JWT, Multer, JSON parsing)
 * into our own ApiError hierarchy, so the response shape is always consistent
 * no matter which library threw the original error.
 */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  if (err.name === 'ValidationError' && err.errors) {
    // Mongoose schema validation error
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return new ValidationError('Validation failed', details);
  }

  if (err.code === 11000) {
    // Mongo duplicate key error
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ConflictError(`${field} already exists`);
  }

  if (err.name === 'CastError') {
    return new ValidationError(`Invalid value for ${err.path}: ${err.value}`);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const { UnauthorizedError } = require('../utils/ApiError');
    return new UnauthorizedError('Invalid or expired token');
  }

  if (err.name === 'MulterError') {
    return new ValidationError(err.message);
  }

  // Unknown/unexpected error - treat as a real bug, don't leak internals.
  const { InternalServerError } = require('../utils/ApiError');
  const wrapped = new InternalServerError(env === 'production' ? 'Something went wrong' : err.message);
  wrapped.stack = err.stack;
  return wrapped;
}

// Must have 4 args for Express to recognize it as an error handler.
const globalErrorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (!error.isOperational) {
    console.error('[UNEXPECTED ERROR]', err); // log full detail server-side only
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    message: error.message,
    details: error.details || undefined,
    stack: env === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { notFoundHandler, globalErrorHandler };
