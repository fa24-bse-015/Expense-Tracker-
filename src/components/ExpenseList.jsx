import React from 'react';

export default function ExpenseList({ expenses, onDelete, onEdit, onDeleteExpense, onEditExpense }) {
  // Safe handler fallback
  const handleDelete = onDelete || onDeleteExpense;
  const handleEdit = onEdit || onEditExpense;

  if (!expenses || expenses.length === 0) {
    return <p className="mt-4 text-gray-500">No expenses added yet.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      <h2 className="text-xl font-bold">Expense History</h2>
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            marginBottom: '8px'
          }}
        >
          <div>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              {expense.category} - ${expense.amount}
            </p>
            <small style={{ color: '#666' }}>
              {expense.date} {expense.note ? `| ${expense.note}` : ''}
            </small>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {handleEdit && (
              <button 
                onClick={() => handleEdit(expense)} 
                style={{ padding: '4px 8px', cursor: 'pointer' }}
              >
                Edit
              </button>
            )}
            {handleDelete && (
              <button 
                onClick={() => handleDelete(expense.id)} 
                style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}