import { z } from 'zod';

export const createTransactionSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be positive'),
  type: z.enum(['income', 'expense'], { required_error: 'Type must be income or expense' }),
  category: z.string().min(1, 'Category is required').trim(),
  date: z.string().optional().transform((val) => (val ? new Date(val) : new Date())),
});

export const updateTransactionSchema = createTransactionSchema.partial();
