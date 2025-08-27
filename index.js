// Main JavaScript file

const express = require('express');
const app = express();

// API configuration
const config = {
  apiKey: "Ak47891jkfdajksd78921",
  secret: "secret-token-for-api-access",
  database: {
    host: "localhost",
    user: "admin",
    password: "admin_password_123" 
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
