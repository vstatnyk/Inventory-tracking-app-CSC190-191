import { render, fireEvent } from "@testing-library/react";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { useState as useStateMock } from "react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

const setInventoryItemsMock = jest.fn();
const setQrcodesMock = jest.fn();
const setSelectedMock = jest.fn();
const setFilteredItemsMock = jest.fn();

const mockProps = {
  numSelected: 2,
  selected: ["item1", "item2"],
  inventoryItems: ["item1", "item2", "item3"],
  setInventoryItems: setInventoryItemsMock,
  setQrcodes: setQrcodesMock,
  setSelected: setSelectedMock,
  setFilteredItems: setFilteredItemsMock,
};

describe("EnhancedTableToolbar", () => {
  beforeEach(() => {
    useStateMock.mockImplementation((init) => [init, jest.fn()]);
  });

  it("renders without crashing", () => {
    render(<EnhancedTableToolbar {...mockProps} />);
  });

  it("displays the number of selected items", () => {
    const { getByText } = render(<EnhancedTableToolbar {...mockProps} />);
    expect(getByText("2 selected")).toBeInTheDocument();
  });

  it("opens the delete dialog when the delete button is clicked", () => {
    const setOpenDeleteDialog = jest.fn();
    useStateMock.mockImplementation(() => [false, setOpenDeleteDialog]);

    const { getByLabelText } = render(<EnhancedTableToolbar {...mockProps} />);
    fireEvent.click(getByLabelText("Delete"));

    expect(setOpenDeleteDialog).toHaveBeenCalledWith(true);
  });
});
