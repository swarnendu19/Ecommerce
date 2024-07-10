import {v2 as cloudinary, UploadApiResponse } from "cloudinary"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SERVICE
  });

  const getBase64 = (file: Express.Multer.File) =>
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  
  export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
    const promises = files.map(async (file) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload(getBase64(file), (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        });
      });
    });
  
    const result = await Promise.all(promises);
  
    return result.map((i) => ({
      public_id: i.public_id,
      url: i.secure_url,
    }));
  };
  
  export const deleteFromCloudinary = async (publicIds: string[]) => {
    const promises = publicIds.map((id) => {
      return new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(id, (error, result) => {
          if (error) return reject(error);
          resolve();
        });
      });
    });
  
    await Promise.all(promises);
  };