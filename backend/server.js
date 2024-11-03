const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up MySQL connection with dialect specified
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'mysql', // Specify the dialect
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Define a simple model
const Item = sequelize.define('Item', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync();

// API routes
app.post('/api/items', async (req, res) => {
  try {
    const item = await Item.create({ name: req.body.name });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
