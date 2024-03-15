import {
  updateUser,
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getUsers,
  registerUser,
  verifyUser,
} from "./api";
import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

jest.mock("axios");

describe("getItems", () => {
  const name = "itemName";
  const description = "itemDescription";
  const quantity = 100;
  const token = "token";

  it("should send a GET request to the correct endpoint with query parameters", async () => {
    const response = { data: [{ name, description, quantity }] };
    axios.get.mockResolvedValue(response);

    const result = await getItems(name, description, quantity, token);

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/items`, {
      params: { name, description, quantity },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toEqual(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.get.mockRejectedValue(error);

    await expect(getItems(name, description, quantity, token)).rejects.toThrow(
      error
    );
  });
});

describe("getItem", () => {
  const id = "123";
  const token = "token";

  it("should send a GET request to the correct endpoint", async () => {
    const response = { data: "data" };
    axios.get.mockResolvedValue(response);

    const result = await getItem(id, token);

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.get.mockRejectedValue(error);

    await expect(getItem(id, token)).rejects.toThrow(error);
  });
});

describe("createItem", () => {
  const name = "newItem";
  const description = "newDescription";
  const quantity = 10;
  const department = "newDepartment";
  const token = "token";

  it("should send a POST request to create an item", async () => {
    const response = { data: "data" };
    axios.post.mockResolvedValue(response);

    const result = await createItem(
      name,
      description,
      quantity,
      department,
      token
    );

    expect(axios.post).toHaveBeenCalledWith(
      `${BASE_URL}/items`,
      { name, description, quantity, department },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.post.mockRejectedValue(error);

    await expect(
      createItem(name, description, quantity, department, token)
    ).rejects.toThrow(error);
  });
});

describe("updateItem", () => {
  const id = "123";
  const name = "updatedItem";
  const description = "updatedDescription";
  const quantity = 20;
  const department = "updatedDepartment";
  const token = "token";

  it("should send a PUT request to update an item", async () => {
    const response = { data: "data" };
    axios.put.mockResolvedValue(response);

    const result = await updateItem(
      id,
      name,
      description,
      quantity,
      department,
      token
    );

    expect(axios.put).toHaveBeenCalledWith(
      `${BASE_URL}/items/${id}`,
      { name, description, quantity, department },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.put.mockRejectedValue(error);

    await expect(
      updateItem(id, name, description, quantity, department, token)
    ).rejects.toThrow(error);
  });
});

describe("deleteItem", () => {
  const id = "123";
  const token = "token";

  it("should send a DELETE request to remove an item", async () => {
    const response = { data: "data" };
    axios.delete.mockResolvedValue(response);

    const result = await deleteItem(id, token);

    expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.delete.mockRejectedValue(error);

    await expect(deleteItem(id, token)).rejects.toThrow(error);
  });
});

describe("updateUser", () => {
  const uid = "123";
  const email = "test@test.com";
  const password = "password";
  const role = "admin";
  const department = "IT";
  const token = "token";

  it("should send a PUT request to the correct endpoint", async () => {
    const response = { data: "data" };
    axios.put.mockResolvedValue(response);

    await updateUser(uid, email, password, role, department, token);

    expect(axios.put).toHaveBeenCalledWith(
      `${BASE_URL}/users/update/${uid}`,
      {
        email: email,
        password: password,
        role: role,
        department: department,
        accountId: uid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });

  it("should return the response data", async () => {
    const response = { data: "data" };
    axios.put.mockResolvedValue(response);

    const result = await updateUser(
      uid,
      email,
      password,
      role,
      department,
      token
    );

    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.put.mockRejectedValue(error);

    await expect(
      updateUser(uid, email, password, role, department, token)
    ).rejects.toThrow(error);
  });
});

describe("getUsers", () => {
  const token = "token";

  it("should send a GET request to fetch users", async () => {
    const response = { data: ["user1", "user2"] };
    axios.get.mockResolvedValue(response);

    const result = await getUsers(token);

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/users/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.get.mockRejectedValue(error);

    await expect(getUsers(token)).rejects.toThrow(error);
  });
});

describe("registerUser", () => {
  const email = "newUser@test.com";
  const password = "password";
  const role = "user";
  const department = "IT";
  const token = "token";

  it("should send a POST request to register a user", async () => {
    const response = { data: "data" };
    axios.post.mockResolvedValue(response);

    const result = await registerUser(email, password, role, department, token);

    expect(axios.post).toHaveBeenCalledWith(
      `${BASE_URL}/users/register`,
      { email, password, role, department },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.post.mockRejectedValue(error);

    await expect(
      registerUser(email, password, role, department, token)
    ).rejects.toThrow(error);
  });
});

describe("verifyUser", () => {
  const idToken = "idToken";

  it("should send a POST request to verify a user", async () => {
    const response = { data: "data" };
    axios.post.mockResolvedValue(response);

    const result = await verifyUser(idToken);

    expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/users/verify`, {
      idToken: idToken,
    });
    expect(result).toBe(response.data);
  });

  it("should throw an error if the request fails", async () => {
    const error = new Error("Request failed");
    axios.post.mockRejectedValue(error);

    await expect(verifyUser(idToken)).rejects.toThrow(error);
  });
});
