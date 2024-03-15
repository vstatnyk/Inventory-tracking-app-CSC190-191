import { render, fireEvent, waitFor } from "@testing-library/react";
import MyDialog from "./CheckInOutDialog";
import * as apiUtils from "../utils/api";

jest.mock("../utils/api", () => ({
  updateItem: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("MyDialog", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { queryByText } = render(
      <MyDialog buttonName="Open Dialog" item={{ quantity: 5 }} />
    );
    expect(queryByText("Open Dialog")).toBeInTheDocument();
    expect(queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("validates quantity input before submission", async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <MyDialog buttonName="Open Dialog" item={{ quantity: 5 }} />
    );
    fireEvent.click(getByText("Open Dialog"));
    const quantityInput = getByLabelText("Quantity");

    fireEvent.change(quantityInput, { target: { value: "-1" } });
    fireEvent.click(getByText("OK"));

    await waitFor(() => {
      expect(
        queryByText("Quantity must not be empty and be greater than 0")
      ).toBeInTheDocument();
    });
  });

  it("shows success message on successful item update", async () => {
    apiUtils.updateItem.mockResolvedValue({
      message: "Item updated successfully",
    });

    const { getByText, getByLabelText } = render(
      <MyDialog buttonName="Open Dialog" item={{ quantity: 5, _id: "123" }} />
    );
    fireEvent.click(getByText("Open Dialog"));
    fireEvent.change(getByLabelText("Quantity"), { target: { value: "10" } });
    fireEvent.click(getByText("OK"));

    await waitFor(() => {
      expect(getByText("success")).toBeInTheDocument();
    });
  });

  it("shows error message on failed item update", async () => {
    apiUtils.updateItem.mockRejectedValue(new Error("Update failed"));

    const { getByText, getByLabelText } = render(
      <MyDialog buttonName="Open Dialog" item={{ quantity: 5, _id: "123" }} />
    );
    fireEvent.click(getByText("Open Dialog"));
    fireEvent.change(getByLabelText("Quantity"), { target: { value: "2" } });
    fireEvent.click(getByText("OK"));

    await waitFor(() => {
      expect(
        getByText("Error updating item: Update failed")
      ).toBeInTheDocument();
    });
  });
});
