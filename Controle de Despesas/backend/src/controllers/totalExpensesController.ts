 
import { Request, Response } from 'express';
import Expense from '../models/expenseModel';

export const getTotalExpenses = async (req: Request, res: Response) => {
    try {
        const total = await Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        res.status(200).json({ total: total[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao calcular total das despesas', error });
    }
};
