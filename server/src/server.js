require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const itemsRoutes = require('./routes/items');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const cors = require("cors");
const authenticateUser = require("./utils/authenticateUser");

const app = express(); // Initialize express app

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // Connect to MongoDB

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Use items routes for paths starting with /items
app.use("/api/items", authenticateUser, itemsRoutes);

// Use users routes for paths starting with /users
app.use("/api/users", usersRoutes);

// Use transactions routes for paths starting with /transactions
app.use("/api/transactions", authenticateUser, transactionsRoutes);

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
