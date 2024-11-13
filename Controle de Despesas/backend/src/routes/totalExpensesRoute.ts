 
import express from 'express';
import { getTotalExpenses } from '../controllers/totalExpensesController';

const router = express.Router();

router.get('/expenses/total', getTotalExpenses);

export default router;
