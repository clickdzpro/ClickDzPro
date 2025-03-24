// server.js - A simple Express server for the Academic Assistant Chatbot

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// API endpoint example (for future use)
app.post('/api/chat', (req, res) => {
  // This is where you would process chat messages if you add a backend
  // For now, just echo back the message
  const message = req.body.message || '';
  
  // Simple response for demonstration
  const response = {
    text: `You said: "${message}". This is a placeholder response from the server.`,
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Handle 404s
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'login.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- Login page: http://localhost:${PORT}/login`);
  console.log(`- Main chatbot: http://localhost:${PORT}/`);
});

// Log server shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});
