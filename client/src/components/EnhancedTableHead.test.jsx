import { render, fireEvent } from '@testing-library/react';
import EnhancedTableHead from './EnhancedTableHead';

describe('EnhancedTableHead', () => {
  const mockOnRequestSort = jest.fn();
  const mockOnSelectAllClick = jest.fn();

  const defaultProps = {
    onSelectAllClick: mockOnSelectAllClick,
    order: 'asc',
    orderBy: 'quantity',
    numSelected: 0,
    rowCount: 5,
    onRequestSort: mockOnRequestSort,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTable = (component) => {
    return render(<table>{component}</table>);
  };

  it('renders without crashing', () => {
    renderWithTable(<EnhancedTableHead {...defaultProps} />);
  });

  it('calls onSelectAllClick when checkbox is clicked', () => {
    const { getByLabelText } = renderWithTable(<EnhancedTableHead {...defaultProps} />);
    const checkbox = getByLabelText('select all items');
    fireEvent.click(checkbox);
    expect(mockOnSelectAllClick).toHaveBeenCalled();
  });

  it('calls onRequestSort when a sortable table header is clicked', () => {
    const { getByText } = renderWithTable(<EnhancedTableHead {...defaultProps} />);
    const sortableHeader = getByText('Quantity'); // replace with one of your sortable headers
    fireEvent.click(sortableHeader);
    expect(mockOnRequestSort).toHaveBeenCalled();
  });

  it('does not call onRequestSort when a non-sortable table header is clicked', () => {
    const { getByText } = renderWithTable(<EnhancedTableHead {...defaultProps} />);
    const nonSortableHeader = getByText('Set URL');
    fireEvent.click(nonSortableHeader);
    expect(mockOnRequestSort).not.toHaveBeenCalled();
  });
});