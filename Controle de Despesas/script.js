document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const value = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];

    try {
        const response = await fetch('http://localhost:5000/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, value, date }),
        });

        if (response.ok) {
            fetchExpenses();
        } else {
            console.error('Erro ao adicionar despesa');
        }
    } catch (error) {
        console.error('Erro de conexão', error);
    }
});

async function fetchExpenses() {
    try {
        const response = await fetch('http://localhost:5000/api/expenses');
        if (response.ok) {
            const expenses = await response.json();
            const total = expenses.reduce((sum, expense) => sum + expense.value, 0);

            // Atualiza o total das despesas
            document.getElementById('total-expenses').innerText = total.toFixed(2);

            // Renderiza a lista de despesas
            const expensesList = document.getElementById('expenses-list');
            expensesList.innerHTML = '';
            expenses.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <p>${expense.description} - R$${expense.value.toFixed(2)} - ${new Date(expense.date).toLocaleDateString('pt-BR')}</p>
                    <button style="background-color: #007bff; color: #fff; border: none; padding: 8px; border-radius: 4px;" onclick="editExpense('${expense._id}')">Alterar</button>
                    <button style="background-color: #dc3545; color: #fff; border: none; padding: 8px; border-radius: 4px;" onclick="deleteExpense('${expense._id}')">Excluir</button>
                `;
                expensesList.appendChild(expenseItem);
            });
        } else {
            console.error('Erro ao buscar despesas');
        }
    } catch (error) {
        console.error('Erro de conexão', error);
    }
}

async function deleteExpense(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchExpenses();
        } else {
            console.error('Erro ao excluir despesa');
        }
    } catch (error) {
        console.error('Erro de conexão', error);
    }
}

async function editExpense(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`);
        if (response.ok) {
            const expense = await response.json();
            document.getElementById('description').value = expense.description;
            document.getElementById('amount').value = expense.value;
            document.getElementById('date').value = new Date(expense.date).toISOString().split('T')[0];

            // Atualizar despesa ao enviar o formulário
            document.getElementById('expense-form').onsubmit = async (e) => {
                e.preventDefault();
                try {
                    const updatedDescription = document.getElementById('description').value;
                    const updatedValue = parseFloat(document.getElementById('amount').value);
                    const updatedDate = document.getElementById('date').value;

                    const updateResponse = await fetch(`http://localhost:5000/api/expenses/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ description: updatedDescription, value: updatedValue, date: updatedDate }),
                    });

                    if (updateResponse.ok) {
                        fetchExpenses();
                        // Resetar o evento onsubmit para cadastrar nova despesa
                        document.getElementById('expense-form').onsubmit = addExpense;
                    } else {
                        console.error('Erro ao atualizar despesa');
                    }
                } catch (error) {
                    console.error('Erro de conexão', error);
                }
            };
        } else {
            console.error('Erro ao buscar despesa para editar');
        }
    } catch (error) {
        console.error('Erro de conexão', error);
    }
}

// Função para adicionar despesa (para ser usada novamente após edição)
function addExpense(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const value = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];

    fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, value, date }),
    }).then(response => {
        if (response.ok) {
            fetchExpenses();
        } else {
            console.error('Erro ao adicionar despesa');
        }
    }).catch(error => {
        console.error('Erro de conexão', error);
    });
}

// Carrega as despesas ao iniciar
fetchExpenses();
