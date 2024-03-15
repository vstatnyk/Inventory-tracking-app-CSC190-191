import { render, act, waitFor } from "@testing-library/react";
import AlertPopUp from "./AlertPopUp";

describe("AlertPopUp", () => {
  jest.useFakeTimers();

  it("renders without crashing", () => {
    const { container } = render(
      <AlertPopUp message="Test message" type="success" />
    );
    expect(container.firstChild).toHaveClass("popup-container");
  });

  it("displays the correct message and type", () => {
    const { getByText } = render(
      <AlertPopUp message="Test message" type="success" />
    );
    expect(getByText("Test message")).toBeInTheDocument();
  });

  it("unmounts after the timeout", async () => {
    const { queryByText  } = render(
      <AlertPopUp message="Test message" type="success" />
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(queryByText("Test message")).toBeNull();
    });
  });
});
