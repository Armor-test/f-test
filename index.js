require('dotenv').config();
const fs = require('fs');
// Main JavaScript file


// Security check for API tokens
if (!process.env.API_KEY) {
  console.error('API key not found in environment variables');
  process.exit(1);
}
const express = require('express');
const app = express();

// API configuration
const config = {
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  database: {
    host: "localhost",
    user: "admin",
    password: process.env.DB_PASSWORD 
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
