const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(100); // Limit to 100 transactions
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;