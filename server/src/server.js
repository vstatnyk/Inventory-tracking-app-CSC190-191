require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const itemsRoutes = require('./routes/items');
const admin = require("../config/FirebaseConfig");
const cors = require("cors");

const app = express(); // Initialize express app

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // Connect to MongoDB

// Middleware to verify Firebase JWT and authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error: " + error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Use items routes for paths starting with /items
app.use("/api/items", authenticateUser, itemsRoutes);

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
