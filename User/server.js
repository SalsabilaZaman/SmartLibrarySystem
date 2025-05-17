require('dotenv').config();
const express = require('express');

const sequelize = require('./config/db');



const userRoutes = require('./api/routes/UserRoute');
const app = express();
app.use(express.json());

// Register Routes
app.use('/api/users', userRoutes);

// Start the server
sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8081, () => {
    console.log(`Server is running on port ${process.env.PORT || 8081}`);
  });
});