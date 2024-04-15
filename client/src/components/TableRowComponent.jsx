import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import edit from "../images/edit-button.svg";

const TableRowComponent = ({
  row,
  isItemSelected,
  labelId,
  handleClick,
  handleRowClick,
  isOpen,
  qrcodes,
  handleSetUrlClick,
  handleDialogOpen,
  handlePrintQRCode,
  handleDownloadQRCode,
}) => {
  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleRowClick(event, row._id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row._id}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onClick={(event) => handleClick(event, row._id)}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="right">{row.department}</TableCell>
        <TableCell align="right">{row.description}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => handleRowClick(event, row._id)}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              mt={1}
            >
              <Box mb={1}>{qrcodes[row._id]}</Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
                mt={1}
              >
                <button onClick={() => handleSetUrlClick(row)}>Set URL</button>
                <button onClick={() => handleDialogOpen(row)}>
                  <img src={edit} alt="Edit Item" className="image" />
                </button>
                <button onClick={() => handlePrintQRCode(row)}>
                  Print QR Code
                </button>
                <button onClick={() => handleDownloadQRCode(row)}>
                  Download QR Code
                </button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

TableRowComponent.propTypes = {
  row: PropTypes.object.isRequired,
  isItemSelected: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  qrcodes: PropTypes.object.isRequired,
  handleSetUrlClick: PropTypes.func.isRequired,
  handleDialogOpen: PropTypes.func.isRequired,
  handlePrintQRCode: PropTypes.func.isRequired,
  handleDownloadQRCode: PropTypes.func.isRequired,
};

export default TableRowComponent;
