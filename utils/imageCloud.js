const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const AppError = require("./appError");

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    // Create a unique public_id
    const public_id = `taskly/${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    // Convert Buffer to a data URI for Cloudinary
    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "taskly",
      format: "webp",
      public_id: public_id,
      resource_type: "auto",
    });

    req.body.photo = result.secure_url;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return next(new AppError("Image upload failed", 500));
  }
};
