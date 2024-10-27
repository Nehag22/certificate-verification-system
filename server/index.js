// server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors
const certificateRoutes = require('./routes/certificateRoutes');
const path = require('path');

const app = express();

connectDB();

// Middleware
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Routes
app.use('/', certificateRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
