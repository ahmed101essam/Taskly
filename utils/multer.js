const multer = require("multer");
const path = require("path");

const fs = require("fs");
const publicDir = "/app/public";

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/public"); // Absolute path for Railway
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo-${Date.now()}${ext}`); // Simpler filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
