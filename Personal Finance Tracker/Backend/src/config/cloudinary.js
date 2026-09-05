import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

/**
 * Upload buffer to Cloudinary with fallback for missing/unconfigured credentials
 * @param {Buffer} buffer File buffer from multer memory storage
 * @param {string} folder Destination folder
 * @returns {Promise<string>} Secure URL of uploaded image
 */
export const uploadToCloudinary = (buffer, folder = 'profile_pictures') => {
  return new Promise((resolve, reject) => {
    // If using placeholder credentials, simulate upload with UI avatar service
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo'
    ) {
      const randomSeed = Math.random().toString(36).substring(7);
      const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
      return resolve(mockUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload Error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
