const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequestError } = require('../utils/ApiError');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new BadRequestError(`Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
};

// ---------- Strategy 1: local disk storage ----------
const localDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, localDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const uploadLocal = multer({ storage: localStorage, fileFilter, limits: { fileSize: MAX_SIZE } });

// ---------- Strategy 2: memory storage, buffer streamed straight to Cloudinary ----------
// No file ever touches this server's disk — used when CLOUDINARY is the active provider.
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage, fileFilter, limits: { fileSize: MAX_SIZE } });

module.exports = { uploadLocal, uploadMemory };
