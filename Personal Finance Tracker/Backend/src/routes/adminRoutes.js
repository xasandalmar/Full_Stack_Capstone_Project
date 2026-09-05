import express from 'express';
import { getAdminOverview } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin routes require JWT authentication + admin role
router.get('/overview', protect, authorizeAdmin, getAdminOverview);

export default router;
