const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Middleware to authorize user based on role
// const authorizeUser = (roles) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;
//     if (roles.includes(userRole)) {
//       next();
//     } else {
//       res.status(403).json({ error: "Forbidden" });
//     }
//   };
// };

// Create a new item
router.post("/", async (req, res) => {
  const newItem = new Item(req.body);
  const savedItem = await newItem.save();
  res.json(savedItem);
});

// Get all items
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Update an item
router.put("/:id", async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

// Delete an item
router.delete("/:id", async (req, res) => {
  const deletedItem = await Item.findByIdAndRemove(req.params.id);
  res.json(deletedItem);
});

module.exports = router;
