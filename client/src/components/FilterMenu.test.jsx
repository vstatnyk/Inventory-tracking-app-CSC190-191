import { render, fireEvent } from "@testing-library/react";
import FilterMenu from "./FilterMenu";

describe("FilterMenu", () => {
  const onFilterSubmit = jest.fn();

  it("renders the filter menu", () => {
    const { getByText } = render(<FilterMenu onFilterSubmit={onFilterSubmit} />);
    expect(getByText("Open Filter Menu")).toBeInTheDocument();
  });

  it("updates filter criteria on input change", () => {
    const { getByLabelText, getByText } = render(<FilterMenu onFilterSubmit={onFilterSubmit} />);
    fireEvent.click(getByText("Open Filter Menu"));
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Test Name" } });
    fireEvent.change(getByLabelText("Description:"), { target: { value: "Test Description" } });
    fireEvent.change(getByLabelText("Quantity:"), { target: { value: "100" } });
    fireEvent.click(getByText("Apply Filter"));
    expect(onFilterSubmit).toHaveBeenCalledWith({
      name: "Test Name",
      description: "Test Description",
      quantity: "100",
    });
  });

  it("submits the filter criteria on 'Apply Filter' button click", () => {
    const { getByText } = render(<FilterMenu onFilterSubmit={onFilterSubmit} />);
    fireEvent.click(getByText("Open Filter Menu"));
    fireEvent.click(getByText("Apply Filter"));
    expect(onFilterSubmit).toHaveBeenCalled();
  });
});