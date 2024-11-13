// Modelo de Despesa (Expense Model)
import mongoose, { Schema, Document } from 'mongoose';

interface IExpense extends Document {
  description: string;
  amount: number;
  date: Date;
}

const ExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
export default Expense;