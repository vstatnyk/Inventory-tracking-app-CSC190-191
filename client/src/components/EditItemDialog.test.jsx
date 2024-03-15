import { render, fireEvent } from '@testing-library/react';
import EditItemDialog from './EditItemDialog';

describe('EditItemDialog', () => {
  const mockHandleDialogClose = jest.fn();
  const mockHandleDialogUpdate = jest.fn();
  const mockSetCurrentItem = jest.fn();

  const props = {
    openDialog: false,
    handleDialogClose: mockHandleDialogClose,
    currentItem: { name: 'Test Item', quantity: '10', department: 'Test Department', description: 'Test Description' },
    setCurrentItem: mockSetCurrentItem,
    handleDialogUpdate: mockHandleDialogUpdate,
    updateItemLoading: false,
  };

  it('renders correctly', () => {
    const { getByText } = render(<EditItemDialog {...props} openDialog={true} />);
    expect(getByText('Edit Item')).toBeInTheDocument();
  });

  it('opens and closes the dialog', () => {
    const { getByText, rerender } = render(<EditItemDialog {...props} />);
    rerender(<EditItemDialog {...props} openDialog={true} />);
    expect(getByText('Edit Item')).toBeVisible();
    fireEvent.click(getByText('Cancel'));
    expect(mockHandleDialogClose).toHaveBeenCalled();
  });

  it('updates the text fields', () => {
    const { getByLabelText } = render(<EditItemDialog {...props} openDialog={true} />);
    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Test Item' } });
    expect(mockSetCurrentItem).toHaveBeenCalledWith({ ...props.currentItem, name: 'New Test Item' });
    fireEvent.change(getByLabelText('Quantity'), { target: { value: '20' } });
    expect(mockSetCurrentItem).toHaveBeenCalledWith({ ...props.currentItem, quantity: '20' });
    fireEvent.change(getByLabelText('Department'), { target: { value: 'New Test Department' } });
    expect(mockSetCurrentItem).toHaveBeenCalledWith({ ...props.currentItem, department: 'New Test Department' });
    fireEvent.change(getByLabelText('Description'), { target: { value: 'New Test Description' } });
    expect(mockSetCurrentItem).toHaveBeenCalledWith({ ...props.currentItem, description: 'New Test Description' });
  });

  it('calls handleDialogUpdate when Update button is clicked', () => {
    const { getByText } = render(<EditItemDialog {...props} openDialog={true} />);
    fireEvent.click(getByText('Update'));
    expect(mockHandleDialogUpdate).toHaveBeenCalled();
  });
});