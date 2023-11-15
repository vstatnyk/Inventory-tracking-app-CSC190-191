const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Transaction = require("../models/Transaction");
const admin = require("../../config/FirebaseConfig");

// Middleware to authorize user based on role
const authorizeUser = (accessLevelRequired) => {
  return async (req, res, next) => {
    const user = await admin.auth().getUser(req.user.uid);
    if (user.customClaims.accessLevel > accessLevelRequired) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

// Create a new item
router.post("/", authorizeUser(2), async (req, res) => {
  const newItem = new Item(req.body);
  const savedItem = await newItem.save();

  const newTransaction = new Transaction({
    userEmail: req.user.email,
    productName: savedItem.name,
    quantity: savedItem.quantity,
    date: Date.now(),
    description: `User ${req.user.email} created item ${savedItem.name} with quantity ${savedItem.quantity}.`,
  });
  await newTransaction.save();

  res.json(savedItem);
});

// Get items with optional filtering by name, description, or quantity
// if no filter, simply displays all items
router.get("/", async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter.name = new RegExp(req.query.name, "i");
  }

  if (req.query.description) {
    filter.description = new RegExp(req.query.description, "i");
  }

  if (req.query.quantity) {
    filter.quantity = parseInt(req.query.quantity, 10);
  }

  const items = await Item.find(filter);
  res.json(items);
});

// Update an item
router.put("/:id", authorizeUser(2), async (req, res) => {
  const item = await Item.findById(req.params.id);
  const oldQuantity = item.quantity;

  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  const quantityChange = updatedItem.quantity - oldQuantity;

  const newTransaction = new Transaction({
    userEmail: req.user.email,
    productName: updatedItem.name,
    quantity: updatedItem.quantity,
    date: Date.now(),
    description: `User ${req.user.email} checked ${
      quantityChange > 0 ? "in" : "out"
    } ${Math.abs(
      quantityChange
    )} item(s). Old quantity: ${oldQuantity}, New quantity: ${
      updatedItem.quantity
    }.`,
  });
  await newTransaction.save();

  res.json(updatedItem);
});

// Delete an item
router.delete("/:id", authorizeUser(2), async (req, res) => {
  const deletedItem = await Item.findByIdAndRemove(req.params.id);

  const newTransaction = new Transaction({
    userEmail: req.user.email,
    productName: deletedItem.name,
    quantity: deletedItem.quantity,
    date: Date.now(),
    description: `User ${req.user.email} deleted item ${deletedItem.name} with quantity ${deletedItem.quantity}.`,
  });
  await newTransaction.save();

  res.json(deletedItem);
});

module.exports = router;
