import FilterListIcon from "@mui/icons-material/FilterList";
import { CircularProgress, InputAdornment, FormControl, InputLabel, Select, MenuItem, Checkbox, OutlinedInput, ListItemText, Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Fuse from "fuse.js";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import * as React from "react";
import { useEffect, useState } from "react";
import { createItem, updateItem } from "../utils/api";
import { exportToCSV } from "../utils/exportToCSV";
import AlertPopUp from "./AlertPopUp";
import AddItemDialog from "./AddItemDialog";
import EditItemDialog from "./EditItemDialog";
import TableRowComponent from "./TableRowComponent";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import SetUrlDialog from "./SetUrlDialog";
import QRCodeSVG from 'qrcode-svg';


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

export default function EnhancedTable({ items }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("qunatity");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [inventoryItems, setInventoryItems] = React.useState(items);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [qrcodes, setQrcodes] = React.useState({});
  const [openRows, setOpenRows] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const [updateItemLoading, setUpdateItemLoading] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState(inventoryItems);
  const [urlDialogOpen, setUrlDialogOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [currentItem, setCurrentItem] = React.useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    department: "",
    description: "",
  });

  const fuse = new Fuse(inventoryItems, {
    keys: ["name", "department"], // Add the keys you want to include in the search
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
  
  const handleChangeDepartmentFilter = (event) => {
    const {
      target: { value },
    } = event;
    
    const selectedDepartments = typeof value === 'string' ? value.split(',') : value;
  
    let filteredItems = inventoryItems;
  
    if (selectedDepartments.length > 0) {

      const searchResults = selectedDepartments.map(department => {
        return fuse.search(department).map(({ item }) => item);
      });
      
      const mergedResults = [].concat(...searchResults);
      
      const uniqueItems = Array.from(new Set(mergedResults));
  
      filteredItems = uniqueItems;
    }
  
    if (searchTerm) {
      const result = fuse.search(searchTerm);
      filteredItems = result.map(({ item }) => item).filter(item => {

        if (selectedDepartments.length > 0) {
          return filteredItems.includes(item);
        }

        return true;
      });
    }
  
    setFilteredItems(filteredItems);
    setDepartmentFilter(selectedDepartments);
  };

  useEffect(() => {
	const cookieValue = localStorage.getItem("rowsPerPage");
	if (cookieValue) {
		setRowsPerPage(cookieValue);
	}
  }, []);

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
      url: item.url ? item.url : "http://localhost:5173/checkinout/" + id,
    };

    const qrCodeString = JSON.stringify(qrCodeData);
    return <QRCode value={qrCodeString} />;
  };

  
  const generateQRSVG = (qrCodeString) => {
    // Log the QR code string to check its content and type
    console.log("QR Code String:", qrCodeString);

    // Create QRCodeSVG instance
    const qrCodeSVG = new QRCodeSVG({
        content: qrCodeString, // Make sure qrCodeString is a string
        container: "svg-viewbox",
        padding: 0,
        width: 200,
        height: 200
    });

    // Get SVG string representation
    return qrCodeSVG.svg();
};

const handleDownloadQRCode = (item) => {
    try {
        // Generate QR code string using item and item._id
        const qrCodeString = generateQRCode(item, item._id);

        // Ensure qrCodeString is a string before proceeding
        if (typeof qrCodeString !== "string") {
            throw new Error("QR code string is not a string.");
        }

        // Generate SVG string from QR code string
        const svgString = generateQRSVG(qrCodeString);

        // Create temporary DOM element to hold the SVG
        const div = document.createElement('div');
        div.innerHTML = svgString;

        // Get the SVG element
        const qrCodeSvg = div.firstChild;

        // Serialize SVG to XML string
        const svgXml = new XMLSerializer().serializeToString(qrCodeSvg);

        // Create data URL for SVG
        const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgXml);

        // Trigger download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qrcode_${item.name}.svg`;
        link.click();
    } catch (error) {
        console.error("Error occurred while downloading QR code:", error);
    }
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

  // const handleAddItem = async () => {
  //   setLoading(true);
  //   const newItemObject = {
  //     name: "New Item",
  //     description: "This is a new item",
  //     quantity: 10,
  //     department: ["New Department"],
  //   };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = async () => {
    setLoading(true);

    const newItem = await createItem(
      formData.name,
      formData.description,
      formData.quantity,
      formData.department,
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

    handleAddDialogClose();
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
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
    if (!selected || selected.length === 0) {
      alert("No items selected to export.");
      return;
    }
  
    const selectedItemsData = inventoryItems.filter((item) =>
      selected.includes(item._id)
    );
    const csv = exportToCSV(selectedItemsData);
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
  
    const downloadButton = `<a href="${url}" download="selected_items.csv" class="download-button">Download CSV</a>`;
  
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

  const handleClickRow = (event, id) => {
    const isOpen = openRows[id];
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [id]: !isOpen,
    }));
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
	localStorage.setItem("rowsPerPage", event.target.value);
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

  const departmentOptions = ["Office", "Finance", "Public Outreach", "Lab", "Operations", "Shop", "Fisheries", "IT"];

  return (
<div style={{ display: "flex" }}>
  {/* Sidebar */}
  <div
    style={{
      width: "10%",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ marginBottom: "10px" }}>
    <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handleAddDialogOpen()}>Add Item</button>
        <button onClick={handleExportClick}>Generate Report</button>
    </div>
    <button onClick={handleDownloadQRCode}>Download selected QR</button>
</div>


    {/* Adjust the style here to define a consistent width */}
    <div style={{ marginBottom: "20px" }}>
      <TextField
        fullWidth
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

    {/* Adjust the style here to ensure consistency with the TextField */}
    <div style={{ width: '100%' }}> {/* Make sure this matches the TextField's width */}
      <FormControl fullWidth sx={{ m: 0 }}>
        <InputLabel id="item-department-filter-selector-label">Filter by Departments</InputLabel>
        <Select
          labelId="item-department-filter-selector-label"
          id="item-department-filter-selector"
          multiple
          value={departmentFilter}
          onChange={handleChangeDepartmentFilter}
          input={<OutlinedInput label="Filter by Department" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {departmentOptions.map((department) => (
          <MenuItem key={department} value={department}>
            <Checkbox checked={departmentFilter.indexOf(department) > -1} />
            <ListItemText primary={department} />
          </MenuItem>
        ))}
        </Select>
      </FormControl>
    </div>
  </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: 20,
        }}
      >
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
                      <TableRowComponent
                        handleClick={handleClick}
                        handleDialogOpen={handleDialogOpen}
                        handleRowClick={handleClickRow}
                        handleSetUrlClick={handleSetUrlClick}
                        isItemSelected={isItemSelected}
                        isOpen={isOpen}
                        labelId={labelId}
                        qrcodes={qrcodes}
                        row={row}
                        key={row._id}
                        handlePrintQRCode={handlePrintQRCode}
                        handleDownloadQRCode={handleDownloadQRCode}
                      />
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
        <EditItemDialog
          openDialog={openDialog}
          handleDialogClose={handleDialogClose}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          handleDialogUpdate={handleDialogUpdate}
          updateItemLoading={updateItemLoading}
        />
        <SetUrlDialog
          urlDialogOpen={urlDialogOpen}
          handleUrlDialogClose={handleUrlDialogClose}
          url={url}
          setUrl={setUrl}
          handleUrlUpdate={handleUrlUpdate}
        />
        <AddItemDialog
          openAddDialog={openAddDialog}
          handleAddDialogClose={handleAddDialogClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleAddItem={handleAddItem}
        />
      </div>
    </div>
  );
}

EnhancedTable.propTypes = {
  items: PropTypes.array.isRequired,
};
