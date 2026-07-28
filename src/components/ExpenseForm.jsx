import React, { useState, useEffect } from 'react';

export default function ExpenseForm({ onSave, editingExpense, clearEdit }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount || '');
      setCategory(editingExpense.category || '');
      setDate(editingExpense.date || '');
      setNote(editingExpense.note || '');
    } else {
      setAmount(''); setCategory(''); setDate(''); setNote('');
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert("Please fill in Amount, Category, and Date!");
      return;
    }

    onSave({ 
      amount: Number(amount), 
      category, 
      date, 
      note 
    });

    setAmount(''); 
    setCategory(''); 
    setDate(''); 
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Amount ($)</label>
        <input 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          placeholder="0.00" 
          required 
        />
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Category</label>
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Date</label>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          required 
        />
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Note (Optional)</label>
        <input 
          type="text" 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          placeholder="Where did you spend..." 
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {editingExpense ? 'Update Expense' : 'Save Expense'}
        </button>
        {editingExpense && (
          <button type="button" onClick={clearEdit} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}