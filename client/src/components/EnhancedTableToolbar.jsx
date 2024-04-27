import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { deleteItem, getUser } from "../utils/api";

export default function EnhancedTableToolbar(props) {
  const {
    numSelected,
    selected,
    inventoryItems,
    setInventoryItems,
    setQrcodes,
    setSelected,
  } = props;

  const [selectedNames, setSelectedNames] = useState([]);
  const [useraccount, setUseraccount] = useState(null);

  useEffect(() => {
    const selectedItemsNames = selected.map(
      (id) => inventoryItems.find((item) => item._id === id)?.name
    );
    setSelectedNames(selectedItemsNames);
  }, [selected, inventoryItems]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(localStorage.getItem("token"));
      setUseraccount(user);
    };
    fetchUser();
  }, []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

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

    handleDeleteDialogClose();
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

      {numSelected > 0 && useraccount.accessLevel > 1 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDeleteDialogOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
          Are you sure you want to delete?
        </DialogTitle>
        <center>
          <List>
            {selectedNames.map((name) => (
              <ListItem key={name}>
                <ListItemText primary={`Item Name: ${name}`} />
              </ListItem>
            ))}
          </List>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleDeleteItem} color="primary" autoFocus>
              Confirm
            </button>
            <button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </button>
          </DialogActions>
        </center>
      </Dialog>
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
