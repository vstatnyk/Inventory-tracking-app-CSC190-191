const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authorizeUser = require('../utils/authorizeUser');
const validator = require('validator'); // Adding the validator library

router.get('/', authorizeUser(2), async (req, res) => {
  try {
    // Validate and sanitize user input, if applicable
    const userInput = req.query.someInput;
    if (!validator.isAlphanumeric(userInput)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Use Mongoose query builder methods to construct a secure query
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(100);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;