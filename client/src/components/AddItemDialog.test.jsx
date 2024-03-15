import { render, fireEvent } from "@testing-library/react";
import AddItemDialog from "./AddItemDialog";

describe("AddItemDialog", () => {
  const mockHandleAddDialogClose = jest.fn();
  const mockHandleInputChange = jest.fn();
  const mockHandleAddItem = jest.fn();

  const props = {
    openAddDialog: true,
    handleAddDialogClose: mockHandleAddDialogClose,
    formData: { name: "", quantity: "", department: "", description: "" },
    handleInputChange: mockHandleInputChange,
    handleAddItem: mockHandleAddItem,
  };

  it("renders correctly", () => {
    const { getByText } = render(<AddItemDialog {...props} />);
    expect(getByText("Add Item")).toBeInTheDocument();
  });

  it("has name, quantity, department, and description input fields", () => {
    const { getByLabelText } = render(<AddItemDialog {...props} />);
    expect(getByLabelText("Name")).toBeInTheDocument();
    expect(getByLabelText("Quantity")).toBeInTheDocument();
    expect(getByLabelText("Department")).toBeInTheDocument();
    expect(getByLabelText("Description")).toBeInTheDocument();
  });

  it("calls handleInputChange when input fields are changed", () => {
    const { getByLabelText } = render(<AddItemDialog {...props} />);
    fireEvent.change(getByLabelText("Name"), { target: { value: "Test" } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("calls handleAddItem when OK button is clicked", () => {
    const { getByText } = render(<AddItemDialog {...props} />);
    fireEvent.click(getByText("OK"));
    expect(mockHandleAddItem).toHaveBeenCalled();
  });

  it("calls handleAddDialogClose when Cancel button is clicked", () => {
    const { getByText } = render(<AddItemDialog {...props} />);
    fireEvent.click(getByText("Cancel"));
    expect(mockHandleAddDialogClose).toHaveBeenCalled();
  });
});
