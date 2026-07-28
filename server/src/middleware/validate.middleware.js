import ApiError from '../utils/ApiError.js';

/**
 * Joi validation middleware factory.
 * Validates req.body against the provided Joi schema.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('. ');
    return next(ApiError.badRequest(message, 'VALIDATION_ERROR'));
  }

  // Replace body with validated/sanitized data
  req.body = value;
  next();
};

export default validate;
