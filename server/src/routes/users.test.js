const request = require("supertest");
const express = require("express");
const admin = require("../../config/FirebaseConfig");
const Account = require("../models/Account");

jest.mock("../../config/FirebaseConfig", () => ({
  auth: () => ({
    listUsers: jest.fn().mockResolvedValue({
      users: [
        {
          uid: "123",
          email: "user1@test.com",
          customClaims: { accessLevel: 2 },
        },
        {
          uid: "456",
          email: "user2@test.com",
          customClaims: { accessLevel: 1 },
        },
      ],
    }),
  }),
}));

jest.mock("../models/Account");

const app = express();
app.get("/users/accounts", async (req, res) => {
  const listUsersResult = await admin.auth().listUsers();
  const users = await Promise.all(
    listUsersResult.users.map(async (userRecord) => {
      const account = await Account.findOne(
        { uid: userRecord.uid },
        { _id: 0, uid: 1, department: 1 }
      );
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        customClaims: userRecord.customClaims,
        department: account ? account.department : [],
      };
    })
  );
  res.json(users);
});

describe("GET /users/accounts", () => {
  beforeEach(() => {
    admin.auth().listUsers.mockResolvedValue({
      users: [
        {
          uid: "123",
          email: "user1@test.com",
          customClaims: { accessLevel: 2 },
        },
        {
          uid: "456",
          email: "user2@test.com",
          customClaims: { accessLevel: 1 },
        },
      ],
    });

    Account.findOne.mockImplementation((query) =>
      Promise.resolve({
        uid: query.uid,
        department: query.uid === "123" ? ["IT"] : ["HR"],
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of user accounts with department information", async () => {
    const response = await request(app)
      .get("/users/accounts")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual([
      {
        uid: "123",
        email: "user1@test.com",
        customClaims: { accessLevel: 2 },
        department: ["IT"],
      },
      {
        uid: "456",
        email: "user2@test.com",
        customClaims: { accessLevel: 1 },
        department: ["HR"],
      },
    ]);

    expect(Account.findOne).toHaveBeenCalledTimes(2);
  });
});
