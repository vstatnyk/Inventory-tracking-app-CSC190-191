import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "./Nav";
import { getAuth, signOut } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Nav", () => {
  beforeEach(() => {
    localStorage.clear();
    getAuth.mockClear();
    signOut.mockClear();
  });

  it("renders the correct active link", () => {
    const { getByText } = render(
      <Router>
        <Nav active="recent" />
      </Router>
    );
    expect(getByText("Recent").closest("a")).toHaveClass("active");
  });

  it("navigates to the correct page when a link is clicked", () => {
    const { getByText } = render(
      <Router>
        <Nav active="recent" />
      </Router>
    );
    fireEvent.click(getByText("Inventory"));
    expect(window.location.pathname).toBe("/inventory");
  });

  it("calls signOut when the logout button is clicked", () => {
    const { getByText } = render(
      <Router>
        <Nav active="recent" />
      </Router>
    );
    fireEvent.click(getByText("Logout"));
    expect(signOut).toHaveBeenCalled();
  });

  it("removes the token from localStorage when the logout button is clicked", async () => {
    localStorage.setItem("token", "123");
    const { getByText } = render(
      <Router>
        <Nav active="recent" />
      </Router>
    );
    fireEvent.click(getByText("Logout"));
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for promises to resolve
    expect(localStorage.getItem("token")).toBeNull();
  });
});
