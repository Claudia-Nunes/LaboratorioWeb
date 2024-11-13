// backend/src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/controle_despesas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
  console.log('Conectado ao MongoDB');
}).catch(error => console.error('Erro ao conectar ao MongoDB:', error));

// Modelo de Despesa
const expenseSchema = new mongoose.Schema({
  description: String,
  value: Number,
  date: Date,
});
const Expense = mongoose.model('Expense', expenseSchema);

// Rotas CRUD para despesas
app.post('/api/expenses', async (req, res) => {
  const { description, value, date } = req.body;
  const expense = new Expense({ description, value, date });
  await expense.save();
  res.json(expense);
});

app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { description, value, date } = req.body;
  const expense = await Expense.findByIdAndUpdate(id, { description, value, date }, { new: true });
  res.json(expense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.json({ message: 'Despesa excluída com sucesso!' });
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
