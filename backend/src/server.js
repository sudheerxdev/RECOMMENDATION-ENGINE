import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend server listening on port ${env.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
