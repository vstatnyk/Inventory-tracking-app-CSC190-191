const request = require("supertest");
const express = require("express");
const Item = require("../models/Item");

jest.mock("../models/Item", () => ({
  findById: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndRemove: jest.fn().mockReturnThis(),
}));

jest.mock("../utils/authorizeUser", () => {
  return () => (req, res, next) => {
    req.user = { email: "test@test.com" }; // Mocked user object
    next();
  };
});

const app = express();
app.get("/items", async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.name = new RegExp(req.query.name, "i");
  }
  const items = await Item.find(filter);
  res.json(items);
});
describe("GET /items", () => {
  it("should return items based on filter", async () => {
    const mockItems = [
      { name: "Item1", description: "Desc1", quantity: 10 },
      { name: "Item2", description: "Desc2", quantity: 20 },
    ];
    Item.find.mockResolvedValue(mockItems);

    const response = await request(app)
      .get("/items?name=Item1")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual(mockItems);
    expect(Item.find).toHaveBeenCalledWith({ name: new RegExp("Item1", "i") });
  });
});
