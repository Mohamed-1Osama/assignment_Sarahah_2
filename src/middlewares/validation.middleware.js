const { ValidationError } = require('../utils/ApiError');

/**
 * Validation Middleware factory.
 * Usage: validate(authValidation.register, 'body')
 * Runs BEFORE the controller, so controllers can trust req.body/params/query.
 */
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false, // collect all errors, not just the first
    stripUnknown: true, // drop fields not defined in the schema
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return next(new ValidationError('Validation failed', details));
  }

  req[property] = value; // replaced with the sanitized/coerced value
  next();
};

module.exports = validate;
