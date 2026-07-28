const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const db = require('./database'); 
const expenseRoutes = require('./routes/expenses'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Expenses API Route
app.use('/api/expenses', expenseRoutes); 

// Main Test Route
app.get('/', (req, res) => {
    res.send("Server is running perfectly.");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});