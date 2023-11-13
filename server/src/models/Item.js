const mongoose = require("mongoose");
const Image = require("./Image");

const itemSchema = new mongoose.Schema({
  product_id: Number, 
  name: String,
  description: String,
  quantity: Number,
  department: String,
  img_id: Number,
});

module.exports = mongoose.model("Item", itemSchema);
