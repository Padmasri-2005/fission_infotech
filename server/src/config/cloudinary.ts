import { v2 as cloudinary } from 'cloudinary';

import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// We need to install multer-storage-cloudinary for this to work elegantly
// If not installed, we can use memory storage. 
// For now, I'll assume we can install it or use a memory buffer workaround.
// Since I cannot run npm install easily without blocking, I will implementation a robust memory buffer upload helper
// instead of relying on the extra package. This is safer given the environment limitations.

// Re-writing code to use Memory Storage + Stream Upload
const storage = multer.memoryStorage();

const upload = multer({ storage });

export { cloudinary, upload };
