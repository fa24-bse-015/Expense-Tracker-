const express = require('express');
const router = express.Router();
const db = require('../database');

// 1. GET ALL EXPENSES
router.get('/', (req, res) => {
    const query = `SELECT * FROM expenses ORDER BY date DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 2. ADD NEW EXPENSE (POST)
router.post('/', (req, res) => {
    const { amount, category, date, note } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number." });
    }
    if (!category || category.trim() === "") {
        return res.status(400).json({ error: "Category is required." });
    }
    if (!date) {
        return res.status(400).json({ error: "Date is required." });
    }

    const query = `INSERT INTO expenses (amount, category, date, note) VALUES (?, ?, ?, ?)`;
    db.run(query, [amount, category, date, note || ''], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            amount,
            category,
            date,
            note: note || ''
        });
    });
});

// 3. UPDATE EXPENSE (PUT)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;

    const query = `UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?`;
    db.run(query, [amount, category, date, note || '', id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Expense updated successfully.", id });
    });
});

// 4. DELETE EXPENSE (DELETE)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM expenses WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Expense deleted successfully.", id });
    });
});

module.exports = router;