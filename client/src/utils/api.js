import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const getItems = async (name, description, quantity, token) => {
  const response = await axios.get(`${BASE_URL}/items`, {
    params: {
      name: name,
      description: description,
      quantity: quantity,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getItem = async (id, token) => {
  const response = await axios.get(`${BASE_URL}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createItem = async (
  name,
  description,
  quantity,
  department,
  token
) => {
  const response = await axios.post(
    `${BASE_URL}/items`,
    {
      name: name,
      description: description,
      quantity: quantity,
      department: department,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateItem = async (
  id,
  name,
  description,
  quantity,
  department,
  token
) => {
  const response = await axios.put(
    `${BASE_URL}/items/${id}`,
    {
      name: name,
      description: description,
      quantity: quantity,
      department: department,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteItem = async (id, token) => {
  const response = await axios.delete(`${BASE_URL}/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUsers = async (token) => {
  const response = await axios.get(`${BASE_URL}/users/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const registerUser = async (
  email,
  password,
  role,
  department,
  token
) => {
  const response = await axios.post(
    `${BASE_URL}/users/register`,
    {
      email: email,
      password: password,
      role: role,
      department: department,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const verifyUser = async (idToken) => {
  const response = await axios.post(`${BASE_URL}/users/verify`, {
    idToken: idToken,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Invalid username or password");
    } else {
      throw error;
    }
  }
};

export const deleteUser = async (uid, token) => {
  const response = await axios.delete(`${BASE_URL}/users/delete/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (
  uid,
  email,
  password,
  role,
  department,
  token
) => {
  const response = await axios.put(
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
  return response.data;
};

export const getTransactions = async (token) => {
  const response = await axios.get(`${BASE_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
