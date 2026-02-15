import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production'
    });
  } catch (error) {
    if (error?.code === 'ENOTFOUND') {
      throw new Error(
        'MongoDB host could not be resolved. Verify MONGODB_URI in backend/.env and ensure it uses your real Atlas cluster host.'
      );
    }
    throw error;
  }
};
