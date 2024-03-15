import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Accounts from "./Accounts";
import { getUsers } from "../utils/api";
import { BrowserRouter } from "react-router-dom";

jest.mock("../utils/api", () => ({
  getUsers: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn(() => Promise.resolve(false)),
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

describe("Accounts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <Accounts />
      </BrowserRouter>
    );
  });

  it("calls getUsers on mount", async () => {
    getUsers.mockResolvedValueOnce([]);
    await act(async () => {
      render(
        <BrowserRouter>
          <Accounts />
        </BrowserRouter>
      );
    });
    expect(getUsers).toHaveBeenCalledTimes(1);
  });
});
