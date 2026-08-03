import React from 'react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses found in this space.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Expenses</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {expenses.map((expense) => (
          <li 
            key={expense.id} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px', 
              borderBottom: '1px solid #ddd' 
            }}
          >
            <div>
              <strong>{expense.category}</strong>: ${expense.amount} ({expense.date})
              {expense.note && <p style={{ margin: '2px 0', fontSize: '13px', color: '#555' }}>{expense.note}</p>}
              
              {/* YAHAN "Added by" TAG ADD HOGAYA HAI */}
              {expense.added_by && (
                <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                  Added by: {expense.added_by}
                </span>
              )}
            </div>

            {onDeleteExpense && (
              <button 
                onClick={() => onDeleteExpense(expense.id)}
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;