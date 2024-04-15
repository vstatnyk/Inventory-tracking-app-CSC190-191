const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authorizeUser = require("../utils/authorizeUser");
const validator = require("validator"); // Adding the validator library

router.get("/", authorizeUser(2), async (req, res) => {
  try {
    // Use Mongoose query builder methods to construct a secure query
    const transactions = await Transaction.find().sort({ date: -1 }).limit(100);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/", authorizeUser(2), async (req, res) => {
  try {
    // Execute the delete operation
    const result = await Transaction.deleteMany({}); // Empty filter to match all documents
    res.json({
      message: "All transactions have been removed",
      details: result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
