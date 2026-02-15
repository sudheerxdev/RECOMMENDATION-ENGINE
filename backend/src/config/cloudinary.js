import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

const hasCloudinaryConfig =
  Boolean(env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(env.CLOUDINARY_API_KEY) &&
  Boolean(env.CLOUDINARY_API_SECRET);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
}

const uploadResumeBuffer = (buffer, filename) =>
  new Promise((resolve, reject) => {
    if (!hasCloudinaryConfig) {
      resolve(null);
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ai-career-platform/resumes',
        resource_type: 'raw',
        public_id: `${Date.now()}-${filename.replace(/[^a-zA-Z0-9-_]/g, '-')}`
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

export { cloudinary, hasCloudinaryConfig, uploadResumeBuffer };
