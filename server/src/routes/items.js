const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
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
  res.json(savedItem);
});

// Get items with optional filtering by name, description, or quantity
// if no filter, simply displays all items
router.get("/", async (req, res) => {
  const filter = {};

  if (req.query.name) {
     filter.name = new RegExp(req.query.name, 'i');
  }

  if (req.query.description) {
     filter.description = new RegExp(req.query.description, 'i');
  }

  if (req.query.quantity) {
    filter.quantity = parseInt(req.query.quantity, 10);
  }

  const items = await Item.find(filter);
  res.json(items);
});

// Update an item
router.put("/:id", authorizeUser(2), async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

// Delete an item
router.delete("/:id", authorizeUser(2), async (req, res) => {
  const deletedItem = await Item.findByIdAndRemove(req.params.id);
  res.json(deletedItem);
});

module.exports = router;
