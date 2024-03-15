import { render, fireEvent } from "@testing-library/react";
import TableRowComponent from "./TableRowComponent";

describe("TableRowComponent", () => {
  const mockHandleClick = jest.fn();
  const mockHandleRowClick = jest.fn();
  const mockHandleSetUrlClick = jest.fn();
  const mockHandleDialogOpen = jest.fn();
  const mockHandlePrintQRCode = jest.fn();
  const mockHandleDownloadQRCode = jest.fn();

  const props = {
    row: {
      _id: "1",
      name: "Test Item",
      quantity: 10,
      department: "Test Department",
      description: "Test Description",
    },
    isItemSelected: false,
    labelId: "test-label",
    handleClick: mockHandleClick,
    handleRowClick: mockHandleRowClick,
    isOpen: false,
    qrcodes: { 1: "Test QR Code" },
    handleSetUrlClick: mockHandleSetUrlClick,
    handleDialogOpen: mockHandleDialogOpen,
    handlePrintQRCode: mockHandlePrintQRCode,
    handleDownloadQRCode: mockHandleDownloadQRCode,
  };

  it("renders correctly", () => {
    const { getByText } = render(
      <table>
        <tbody>
          <TableRowComponent {...props} />
        </tbody>
      </table>
    );
    expect(getByText("Test Item")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
    expect(getByText("Test Department")).toBeInTheDocument();
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  it("calls handleClick when checkbox is clicked", () => {
    const { getByLabelText } = render(
      <table>
        <tbody>
          <TableRowComponent {...props} />
        </tbody>
      </table>
    );
    fireEvent.click(getByLabelText("Test Item"));
    expect(mockHandleClick).toHaveBeenCalledWith(expect.anything(), "1");
  });

  it("calls handleRowClick when row is clicked", () => {
    const { getByText } = render(
      <table>
        <tbody>
          <TableRowComponent {...props} />
        </tbody>
      </table>
    );
    fireEvent.click(getByText("Test Item"));
    expect(mockHandleRowClick).toHaveBeenCalledWith(expect.anything(), "1");
  });
});
