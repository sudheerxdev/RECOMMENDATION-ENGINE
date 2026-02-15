import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const payload = req[source];
  const result = schema.safeParse(payload);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    throw new ApiError(400, 'Validation failed', details);
  }

  req[source] = result.data;
  next();
};
