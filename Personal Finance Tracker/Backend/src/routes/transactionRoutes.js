import express from 'express';
import {
  createTransaction,
  getTransactions,
  getMonthlySummary,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transactionSchemas.js';

const router = express.Router();

// All transaction routes are protected by JWT authentication
router.use(protect);

router.post('/', validateRequest(createTransactionSchema), createTransaction);
router.get('/', getTransactions);
router.get('/monthly-summary', getMonthlySummary);
router.put('/:id', validateRequest(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
