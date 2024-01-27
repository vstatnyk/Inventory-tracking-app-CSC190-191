const mongoose = require("mongoose");
const Item = require("./Item");

const inventorySchema = new mongoose.Schema({
  product_id: Item,
  quantity: Number,
  date: Date,
  time: String, // Time to string
});

module.exports = mongoose.model("Inventory", inventorySchema);
