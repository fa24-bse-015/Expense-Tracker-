const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file ka rasta (path) set karna
const dbPath = path.resolve(__dirname, 'expenses.db');

// Database se connect hona (agar file nahi hogi to ye khud naye naam se bana dega)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database successfully.');
        initializeTables();
    }
});

// Tables banane ka function
function initializeTables() {
    // 1. Users Table (Day 3 ke kaam ke liye pehle se bana kar rakh lete hain)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // 2. Expenses Table (Jis me amount, category, date aur note hoga)
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
}

module.exports = db;