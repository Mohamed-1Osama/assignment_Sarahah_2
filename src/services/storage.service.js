const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const { baseUrl } = require('../config/env');
const { InternalServerError } = require('../utils/ApiError');


async function uploadToCloudinary(fileBuffer, folder = 'confession-app') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new InternalServerError('Cloudinary upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

function uploadLocalFile(file) {
  
  return { url: `${baseUrl}/uploads/${file.filename}`, publicId: file.filename };
}

async function remove(publicId, provider = 'cloudinary') {
  if (!publicId) return;
  if (provider === 'cloudinary') {
    await cloudinary.uploader.destroy(publicId);
  } else {
    const filePath = path.join(process.cwd(), 'uploads', publicId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

module.exports = { uploadToCloudinary, uploadLocalFile, remove };
