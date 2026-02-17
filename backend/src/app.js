import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import {
  allowedFrontendOriginPatterns,
  allowedFrontendOrigins,
  env,
  isProd,
  trustProxy
} from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.set('trust proxy', trustProxy);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 400 : 1000,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());

const normalizedAllowedOrigins = [...new Set(allowedFrontendOrigins)];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d{2,5})?$/i.test(origin);
      const isAllowedOrigin = normalizedAllowedOrigins.includes(origin);
      const isAllowedByPattern = allowedFrontendOriginPatterns.some((pattern) => pattern.test(origin));

      if (isAllowedOrigin || isAllowedByPattern || (!isProd && isLocalhost)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS: Origin not allowed'));
    },
    credentials: true
  })
);
app.use(limiter);
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan(isProd ? 'combined' : 'dev'));

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
