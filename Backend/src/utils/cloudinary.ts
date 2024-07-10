import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// // Log environment variables to ensure they are loaded
// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getBase64 = (file: Express.Multer.File) => 
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
  const promises = files.map(async (file) => {
    const base64 = getBase64(file);
    try {
      const result = await cloudinary.uploader.upload(base64);
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error: any) {
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  });

  return await Promise.all(promises);
};

export const deleteFromCloudinary = async (publicIds: string[]) => {
  const promises = publicIds.map(async (id) => {
    try {
      await cloudinary.uploader.destroy(id);
    } catch (error: any) {
      throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
    }
  });

  await Promise.all(promises);
};
