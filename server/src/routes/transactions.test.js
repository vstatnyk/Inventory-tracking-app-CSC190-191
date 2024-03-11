const request = require("supertest");
const express = require("express");
const Transaction = require("../models/Transaction"); // adjust this path to your Transaction model

jest.mock("../models/Transaction", () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
}));

const app = express();
app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 }).limit(100);
  res.json(transactions);
});

describe("GET /transactions", () => {
  it("should return the latest 100 transactions", async () => {
    const mockTransactions = [...Array(100)].map((_, i) => ({
      date: Date.now() - i,
    }));
    Transaction.limit.mockResolvedValue(mockTransactions);

    const res = await request(app)
      .get("/transactions")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(mockTransactions);
    expect(Transaction.find).toHaveBeenCalled();
    expect(Transaction.sort).toHaveBeenCalledWith({ date: -1 });
    expect(Transaction.limit).toHaveBeenCalledWith(100);
  });
});
