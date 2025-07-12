require('dotenv').config();
const express = require('express');

const sequelize = require('./config/db');



const bookRoutes = require('./api/routes/BookRoute');
const app = express();
app.use(express.json());


app.use('/api/books', bookRoutes);

// Start the server
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8082, () => {
    console.log(`Server is running on port ${process.env.PORT || 8082}`);
  });
});