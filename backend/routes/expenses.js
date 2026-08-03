const express = require('express');
const router = express.Router();
const db = require('../database');

// 1. Get Expenses (Personal or Household)
router.get('/', (req, res) => {
  const { householdId, userId } = req.query;

  if (householdId) {
    // Check if user belongs to this household
    const checkMemberQuery = `SELECT role FROM household_members WHERE household_id = ? AND user_id = ?`;
    
    db.get(checkMemberQuery, [householdId, userId || 1], (err, member) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // If not a member, return 403 Forbidden error
      if (!member) {
        return res.status(403).json({ error: 'Access Denied: You are not a member of this household.' });
      }

      // Fetch expenses for this household
      const getHouseholdExpenses = `SELECT * FROM expenses WHERE household_id = ?`;
      db.all(getHouseholdExpenses, [householdId], (expErr, rows) => {
        if (expErr) return res.status(500).json({ error: expErr.message });
        res.json(rows);
      });
    });
  } else {
    // Fetch personal expenses
    const getPersonalExpenses = `SELECT * FROM expenses WHERE household_id IS NULL`;
    db.all(getPersonalExpenses, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// 2. Add New Expense
router.post('/', (req, res) => {
  const { amount, category, date, note, householdId, userId } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category, and date are required.' });
  }

  const addedBy = userId ? `User ${userId}` : 'User 1';

  const insertQuery = `
    INSERT INTO expenses (amount, category, date, note, household_id, added_by) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(insertQuery, [amount, category, date, note || '', householdId || null, addedBy], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: this.lastID,
      amount,
      category,
      date,
      note,
      householdId: householdId || null,
      addedBy
    });
  });
});

module.exports = router;