const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userEmail: String,
  productName: String,
  quantity: Number,
  date: Date,
  description: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
