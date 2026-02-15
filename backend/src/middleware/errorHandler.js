import { isProd } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  if (err?.name === 'MulterError') {
    statusCode = 400;
    message = `Upload error: ${err.message}`;
  }

  if (err?.message?.startsWith('CORS:')) {
    statusCode = 403;
  }

  if (err?.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value error';
  }

  const response = {
    success: false,
    message
  };

  if (err instanceof ApiError && err.details) {
    response.details = err.details;
  }

  if (!isProd && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
