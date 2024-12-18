// Import required modules
const express = require('express');
const connectDB = require('./server/config/database'); // Database connection file
require('dotenv').config(); // Load environment variables

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Routes
// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to Busy Bee Learning!');
});

// Example route group for users (you can add actual route logic later)
app.use('/api/users', require('./server/routes/authRoutes'));
app.use('/api/quiz', require('./server/routes/quizRoutes'));

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
