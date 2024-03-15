import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AddAccountDialog from "./AddAccountDialog";
import { registerUser, getUsers } from "../utils/api";

jest.mock("../utils/api", () => ({
  registerUser: jest.fn(),
  getUsers: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("AddAccountDialog", () => {
  it("renders without crashing", () => {
    render(<AddAccountDialog setAccounts={() => {}} />);
  });

  it("opens the form when Add Account button is clicked", async () => {
    render(<AddAccountDialog setAccounts={() => {}} />);
    const button = screen.getByRole("button", { name: /add account/i });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });

  it("calls registerUser and getUsers when form is submitted", async () => {
    render(<AddAccountDialog setAccounts={() => {}} />);

    fireEvent.click(screen.getByText("Add Account"));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    const submitButton = await screen.findByText("OK");
    fireEvent.click(submitButton);

    await waitFor(() => expect(registerUser).toHaveBeenCalled());
    await waitFor(() => expect(getUsers).toHaveBeenCalled());
  });

  it("handles registerUser failure gracefully", async () => {
    registerUser.mockRejectedValueOnce(new Error("Registration failed"));
    render(<AddAccountDialog setAccounts={() => {}} />);
    fireEvent.click(screen.getByText("Add Account"));
    fireEvent.click(screen.getByText("OK"));
    await waitFor(() =>
      expect(screen.getByText("Registration failed")).toBeInTheDocument()
    );
  });
});
