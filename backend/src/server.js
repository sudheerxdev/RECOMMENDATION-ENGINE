import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

let server;
let isShuttingDown = false;

const shutdownGracefully = (signal) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  // eslint-disable-next-line no-console
  console.log(`${signal} received. Starting graceful shutdown...`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(async () => {
    try {
      await mongoose.connection.close(false);
    } finally {
      process.exit(0);
    }
  });

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10000).unref();
};

const start = async () => {
  try {
    await connectDB();
    server = app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend server listening on port ${env.PORT}`);
    });
    server.on('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
        console.error(`Port ${env.PORT} is already in use. Stop the existing process or change PORT.`);
      } else {
        // eslint-disable-next-line no-console
        console.error('Server listen error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection:', reason);
  shutdownGracefully('unhandledRejection');
});
process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught exception:', error);
  shutdownGracefully('uncaughtException');
});

start();
