const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    fs.unlinkSync(localFilePath); // Remove local file after upload
    return result;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { uploadOnCloudinary };
