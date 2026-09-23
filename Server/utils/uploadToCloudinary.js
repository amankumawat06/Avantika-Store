import cloudinary from "../config/cloudinaryy.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  folderName,
  resourceType = "image",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: resourceType,
      },
      (result, error) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(fileBuffer.Promise(stream)).pipe(uploadStream);
  });
};
