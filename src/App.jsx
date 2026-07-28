import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSaveExpense = async (expenseData) => {
    try {
      let response;
      if (editingExpense) {
        response = await fetch(`http://localhost:5000/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });
        setEditingExpense(null);
      } else {
        response = await fetch('http://localhost:5000/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });
      }

      if (response.ok) {
        fetchExpenses(); // Re-fetch expenses from database instantly
      } else {
        alert("Failed to save data on server. Make sure server is running.");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Error connecting to server!");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Expense Tracker App</h1>
      
      <div style={{ padding: '12px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
        Total Expense: Rs. {totalAmount.toFixed(2)}
      </div>

      <ExpenseForm 
        onSave={handleSaveExpense} 
        editingExpense={editingExpense} 
        clearEdit={() => setEditingExpense(null)} 
      />

      <ExpenseList 
        expenses={expenses} 
        onDelete={handleDeleteExpense}
        onDeleteExpense={handleDeleteExpense} 
        onEdit={(expense) => setEditingExpense(expense)}
        onEditExpense={(expense) => setEditingExpense(expense)} 
      />
    </div>
  );
}

export default App;