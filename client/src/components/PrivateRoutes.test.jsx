import { render, waitFor } from "@testing-library/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

jest.mock("react-firebase-hooks/auth");
jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
  Outlet: jest.fn(() => null),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
}));

describe("PrivateRoutes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    useAuthState.mockReturnValue([null, true]);
    const { getByText } = render(<PrivateRoutes />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Outlet when user is authenticated", async () => {
    useAuthState.mockReturnValue([{ uid: "123" }, false]);
    render(<PrivateRoutes />);
    await waitFor(() => expect(Outlet).toHaveBeenCalled());
  });

  it("renders Navigate to login when user is not authenticated", async () => {
    useAuthState.mockReturnValue([null, false]);
    render(<PrivateRoutes />);
    await waitFor(() =>
      expect(Navigate).toHaveBeenCalledWith({ to: "/login", replace: true }, {})
    );
  });
});
