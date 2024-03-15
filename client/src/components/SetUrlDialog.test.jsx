import { render, fireEvent } from "@testing-library/react";
import SetUrlDialog from "./SetUrlDialog";

describe("SetUrlDialog", () => {
  const handleUrlDialogClose = jest.fn();
  const setUrl = jest.fn();
  const handleUrlUpdate = jest.fn();

  it("renders the dialog when urlDialogOpen is true", () => {
    const { getByRole } = render(
      <SetUrlDialog
        urlDialogOpen={true}
        handleUrlDialogClose={handleUrlDialogClose}
        url="http://example.com"
        setUrl={setUrl}
        handleUrlUpdate={handleUrlUpdate}
      />
    );
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render the dialog when urlDialogOpen is false", () => {
    const { queryByRole } = render(
      <SetUrlDialog
        urlDialogOpen={false}
        handleUrlDialogClose={handleUrlDialogClose}
        url="http://example.com"
        setUrl={setUrl}
        handleUrlUpdate={handleUrlUpdate}
      />
    );
    expect(queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("displays the correct URL", () => {
    const { getByLabelText } = render(
      <SetUrlDialog
        urlDialogOpen={true}
        handleUrlDialogClose={handleUrlDialogClose}
        url="http://example.com"
        setUrl={setUrl}
        handleUrlUpdate={handleUrlUpdate}
      />
    );
    expect(getByLabelText("URL").value).toBe("http://example.com");
  });

  it("calls setUrl when the URL is changed", () => {
    const { getByLabelText } = render(
      <SetUrlDialog
        urlDialogOpen={true}
        handleUrlDialogClose={handleUrlDialogClose}
        url="http://example.com"
        setUrl={setUrl}
        handleUrlUpdate={handleUrlUpdate}
      />
    );
    fireEvent.change(getByLabelText("URL"), { target: { value: "http://new-url.com" } });
    expect(setUrl).toHaveBeenCalledWith("http://new-url.com");
  });

  it("calls handleUrlUpdate when the 'Update URL' button is clicked", () => {
    const { getByText } = render(
      <SetUrlDialog
        urlDialogOpen={true}
        handleUrlDialogClose={handleUrlDialogClose}
        url="http://example.com"
        setUrl={setUrl}
        handleUrlUpdate={handleUrlUpdate}
      />
    );
    fireEvent.click(getByText("Update URL"));
    expect(handleUrlUpdate).toHaveBeenCalled();
  });
});