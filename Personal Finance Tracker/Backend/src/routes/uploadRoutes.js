import express from 'express';
import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/profile-picture', protect, uploadSingleImage, uploadProfilePicture);

export default router;
