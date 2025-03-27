const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const AppError = require('./appError');

// Configure Cloudinary globally
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const filePath = req.file.path;

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'taskly',
            format: 'webp',
            public_id: path.parse(req.file.filename).name, // Ensure correct filename
        });

        // Remove the file from local storage after upload
        fs.unlinkSync(filePath);

        // Store the Cloudinary image URL in request body
        req.body.photo = result.secure_url;
        next()
    } catch (error) {
        console.error(error);
        return next(new AppError("Something went wrong while uploading the image", 500));
    }
};
