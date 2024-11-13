// Controlador de Despesas (Expense Controller)
import { Request, Response } from 'express';
import Expense from '../models/expenseModel';

// Adicionar uma nova despesa
export const addExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, date } = req.body;
    const newExpense = new Expense({ description, amount, date });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar despesa', error });
  }
};

// Buscar todas as despesas e calcular o total
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.status(200).json({ expenses, total });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar despesas', error });
  }
};

// Atualizar uma despesa
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar despesa', error });
  }
};

// Excluir uma despesa
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }
    res.status(200).json({ message: 'Despesa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir despesa', error });
  }
};
