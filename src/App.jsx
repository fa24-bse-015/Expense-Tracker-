import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryDashboard from './components/SummaryDashboard';
import HouseholdManager from './components/HouseholdManager';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [activeHousehold, setActiveHousehold] = useState(null);
  const currentUserId = 1; // Temporary Demo User ID

  // 1. Fetch Expenses (Personal vs Household)
  const fetchExpenses = async () => {
    try {
      const url = activeHousehold 
        ? `/api/expenses?householdId=${activeHousehold}&userId=${currentUserId}`
        : `/api/expenses`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  // Run fetch whenever activeHousehold changes
  useEffect(() => {
    fetchExpenses();
  }, [activeHousehold]);

  // 2. Add New Expense
  const handleAddExpense = async (expenseData) => {
    try {
      const payload = {
        ...expenseData,
        householdId: activeHousehold,
        userId: currentUserId
      };

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchExpenses(); // Refresh expenses list
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>SpendWise - Personal & Household Expense Tracker</h1>

      {/* Household / Personal Mode Switcher */}
      <HouseholdManager 
        activeHousehold={activeHousehold} 
        setActiveHousehold={setActiveHousehold} 
        userId={currentUserId} 
      />

      {/* Expense Input Form */}
      <ExpenseForm onAddExpense={handleAddExpense} />

      {/* Summary Dashboard */}
      <SummaryDashboard expenses={expenses} />

      {/* List of Expenses */}
      <ExpenseList expenses={expenses} onDeleteExpense={fetchExpenses} />
    </div>
  );
}

export default App;