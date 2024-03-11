import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CircularProgress, InputAdornment } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
// import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import Fuse from "fuse.js";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import * as React from "react";
import { useEffect, useState } from "react";
import edit from "../images/edit-button.svg";
import { createItem, deleteItem, updateItem } from "../utils/api";
import { exportToCSV } from "../utils/exportToCSV";
import AlertPopUp from "./AlertPopUp";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Item Name",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "department",
    numeric: true,
    disablePadding: false,
    label: "Department",
    disableSorting: true,
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "Description",
    disableSorting: true,
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all items",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.disableSorting ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        {/* Add the "Set URL" column header */}
        <TableCell align="right">Set URL</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    selected,
    inventoryItems,
    setInventoryItems,
    setQrcodes,
    setFilteredItems,
    setSelected,
  } = props;

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleDeleteItem = async () => {
    const itemsToDelete = [...selected]; // Copy selected items
    setSelected([]); // Clear selection immediately

    for (const item of itemsToDelete) {
      await deleteItem(item, localStorage.getItem("token"));
    }

    // Filter out deleted items
    const updatedItems = inventoryItems.filter(
      (item) => !itemsToDelete.includes(item._id)
    );

    setInventoryItems(updatedItems);

    // Remove QR codes for the deleted items
    setQrcodes((prevQrcodes) => {
      const newQrcodes = { ...prevQrcodes };
      itemsToDelete.forEach((item) => {
        delete newQrcodes[item];
      });
      return newQrcodes;
    });
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteItem}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null
      }
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  inventoryItems: PropTypes.array.isRequired,
  setInventoryItems: PropTypes.func.isRequired,
  setQrcodes: PropTypes.func.isRequired,
  setFilteredItems: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default function EnhancedTable({ items }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("qunatity");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [inventoryItems, setInventoryItems] = React.useState(items);
  const [qrcodes, setQrcodes] = React.useState({});
  const [openRows, setOpenRows] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [updateItemLoading, setUpdateItemLoading] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState(inventoryItems);
  const [urlDialogOpen, setUrlDialogOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [currentItem, setCurrentItem] = React.useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fuse = new Fuse(inventoryItems, {
    keys: ["name"], // Add the keys you want to include in the search
    threshold: 0.3, // Adjust the threshold according to your needs
  });

 // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      const result = fuse.search(e.target.value);
      setFilteredItems(result.map(({ item }) => item));
    } else {
      setFilteredItems(inventoryItems);
    }
  };

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
    }
  }, [showAlert]);
  // const [qrCodeString, setQRCodeString] = React.useState("");

  const handleSetUrlClick = (item) => {
    console.log("Set URL button clicked for item:", item);
    setCurrentItem(item);
    setUrlDialogOpen(true);
    setUrl(item.url || ""); // Set the URL input with the current item's URL
  };

  const handleUrlDialogClose = () => {
    setUrlDialogOpen(false);
  };

  const handleUrlUpdate = () => {
    setLoading(true);
    // Check if there is a current item set
    if (currentItem) {
      setCurrentItem((prevItem) => ({
        ...prevItem,
        url: url,
      }));

      // Update the QR code with the latest URL
      const updatedQRCode = <QRCode value={JSON.stringify({ url: url })} />;
      setQrcodes((prevQrcodes) => ({
        ...prevQrcodes,
        [currentItem._id]: updatedQRCode,
      }));
      setAlert(["Success", "success"]);
      setShowAlert(true);
    }
    setLoading(false);
    // Close the URL dialog
    handleUrlDialogClose();
  };

  React.useEffect(() => {
    setInventoryItems(items);
    console.log("Items:", items);
  }, [items]);

  React.useEffect(() => {
    setFilteredItems(inventoryItems);
  }, [inventoryItems]);

  React.useEffect(() => {
    // Generate QR codes for all items
    const qrCodeData = {};
    inventoryItems.forEach((item) => {
      // Check if the item has an associated QR code in the state
      const hasExistingQRCode = item._id in qrcodes && qrcodes[item._id];

      // Check if the URL has changed for the item
      const urlChanged =
        hasExistingQRCode && item.url !== hasExistingQRCode.props.value.url;

      if (!urlChanged && hasExistingQRCode) {
        // If the URL hasn't changed and there's an existing QR code, use it
        qrCodeData[item._id] = hasExistingQRCode;
      } else {
        // If the URL has changed or there's no existing QR code, generate a new QR code
        qrCodeData[item._id] = generateQRCode(item, String(item._id));
      }
    });
    setQrcodes(qrCodeData);
  }, [inventoryItems, qrcodes]);

  const generateQRCode = (item, id) => {
    const qrCodeData = {
      url: item.url ? item.url : `http://localhost:5173/checkinout/${id}`,
    };
  
    const qrCodeString = JSON.stringify(qrCodeData);
    return <QRCode value={qrCodeString} />;
  };

  const handleDownloadQRCode = (item) => {
    const qrCodeSvg = generateQRCode(item, item._id);
    const dataUrl = qrCodeSvg.toDataURL("image/png");
  
    // Trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode_${item.name}.png`;
    link.click();
  };

  const handlePrintQRCode = (item) => {
    const qrCodeSvg = generateQRCode(item, item._id);
  
    // Create a new window with the QR code
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
        </head>
        <body>
          ${qrCodeSvg.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            };
          </script>
        </body>
      </html>
    `);
  };
  

  const handleAddItem = async () => {
    setLoading(true);
    const newItemObject = {
      name: "New Item",
      description: "This is a new item",
      quantity: 10,
      department: ["New Department"],
    };

    const newItem = await createItem(
      newItemObject.name,
      newItemObject.description,
      newItemObject.quantity,
      newItemObject.department,
      localStorage.getItem("token")
    );
    console.log("New item:", newItem._id);

    setInventoryItems((prevItems) => [...prevItems, newItem]);

    // Generate QR code for the new item
    setQrcodes((prevQrcodes) => ({
      ...prevQrcodes,
      [newItem._id]: generateQRCode(newItem, String(newItem._id)),
    }));
    setAlert(["Success", "success"]);
    setLoading(false);
    setShowAlert(true);
  };

  const handleDialogOpen = (item) => {
    setCurrentItem(item);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogUpdate = async () => {
    setLoading(true);
    setUpdateItemLoading(true);
    try {
      await updateItem(
        currentItem._id,
        currentItem.name,
        currentItem.description,
        currentItem.quantity,
        currentItem.department,
        localStorage.getItem("token")
      );

      const index = inventoryItems.findIndex(
        (item) => item._id === currentItem._id
      );

      const newInventoryItems = [...inventoryItems];
      newInventoryItems[index] = currentItem;

      setInventoryItems(newInventoryItems);
      handleDialogClose();
      setAlert(["Success", "success"]);
      setShowAlert(true);
    } catch (error) {
      setAlert(["Error updating item: " + error, "error"]);
      setShowAlert(true);
      console.error("Error updating item:", error);
    } finally {
      setUpdateItemLoading(false);
    }
    setLoading(false);
  };

  const handleExportClick = () => {
    if (!inventoryItems || inventoryItems.length === 0) {
      alert("No inventory items to export.");
      return;
    }

    const csv = exportToCSV(inventoryItems);
    const rows = csv.split("\n");
    const header = rows[0]
      .split(",")
      .map((cell) => `<th>${cell}</th>`)
      .join("");
    const body = rows
      .slice(1)
      .map(
        (row) =>
          `<tr>${row
            .split(",")
            .map((cell) => `<td>${cell}</td>`)
            .join("")}</tr>`
      )
      .join("");

    const fullHtml = `<table><thead>${header}</thead><tbody>${body}</tbody></table>`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const downloadButton = `<a href="${url}" download="inventory.csv" class="download-button">Download CSV</a>`;

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        tr:hover { background-color: #ddd; }
        .download-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #008CBA;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s, transform 0.2s;
        }
        .download-button:hover {
          background-color: #005f73;
          transform: scale(1.05);
        }
        @media (max-width: 600px) {
          table { width: 100%; }
          th, td { padding: 10px; }
        }
      </style>
    `;

    const newWindow = window.open();
    newWindow.document.write(styles + fullHtml + downloadButton);
    newWindow.document.close();
  };

  const handleRowClick = (event, id) => {
    event.stopPropagation();
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [id]: !prevOpenRows[id],
    }));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = inventoryItems.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - inventoryItems.length)
      : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredItems, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredItems]
  );

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "10%", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
          <button onClick={handleAddItem}>Add Item</button>
          <button onClick={handleExportClick}>Generate Report</button>  
        </div>
        <TextField
          value={searchTerm}
          onChange={handleSearchChange}
          label="Filter By Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
  
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {showAlert && <AlertPopUp message={alert[0]} type={alert[1]} />}
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              selected={selected}
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
              setQrcodes={setQrcodes}
              setFilteredItems={setFilteredItems}
              setSelected={setSelected}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={inventoryItems.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const isOpen = openRows[row._id];
  
                    return (
                      <>
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row._id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                          <TableCell align="right">{row.department}</TableCell>
                          <TableCell align="right">{row.description}</TableCell>
                          <TableCell align="right" style={{ width: "10%" }}>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={(event) => handleRowClick(event, row._id)}
                            >
                              {isOpen ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                                mt={1}
                              >
                                <Box mb={1}>{qrcodes[row._id]}</Box>
                                <Button onClick={() => handleSetUrlClick(row)}>
                                  Set URL
                                </Button>
                                <button onClick={() => handleDialogOpen(row)}>
                                  <img
                                    src={edit}
                                    alt="Edit Item"
                                    className="image"
                                  />
                                </button>

                                <button onClick={handleAddItem}>handlePrintQRCode</button>
                                <button onClick={handleAddItem}>handleDownloadQRCode</button>

                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 33 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={inventoryItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={currentItem?.name}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, name: e.target.value })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              id="quantity"
              label="Quantity"
              type="text"
              fullWidth
              variant="standard"
              value={currentItem?.quantity}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, quantity: e.target.value })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              id="department"
              label="Department"
              type="text"
              fullWidth
              variant="standard"
              value={currentItem?.department}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, department: e.target.value })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={currentItem?.description}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, description: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            {updateItemLoading ? (
              <CircularProgress size={50} />
            ) : (
              <>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleDialogUpdate}>Update</Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={urlDialogOpen} onClose={handleUrlDialogClose}>
          <DialogTitle>Set URL</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="url"
              label="URL"
              type="text"
              fullWidth
              variant="standard"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUrlDialogClose}>Cancel</Button>
            <Button onClick={handleUrlUpdate}>Update URL</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

EnhancedTable.propTypes = {
  items: PropTypes.array.isRequired,
};
