import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // File system in Node.js

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File path is invalid or file does not exist.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    console.log("File uploaded successfully:", response.url);
    return response.url; // Return only the URL, if that's all you need
  } catch (error) {
    console.error("Error during file upload:", error);

    // Remove the file from the local machine asynchronously
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    return null; // Indicate failure
  }
};
export { uploadOnCloudinary };
