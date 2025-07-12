require('dotenv').config();
const express = require('express');

const sequelize = require('./config/db');


const loanRoutes = require('./api/routes/LoanRoute');
const app = express();
app.use(express.json());

// Register Routes
app.use('/api/loans',loanRoutes);

// Start the server
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8083, () => {
    console.log(`Server is running on port ${process.env.PORT || 8083}`);
  });
});