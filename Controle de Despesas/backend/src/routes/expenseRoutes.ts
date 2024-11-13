 
import express from 'express';
import { addExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expenseController';

const router = express.Router();

router.post('/expenses', addExpense);
router.get('/expenses', getExpenses);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);


export default router;
