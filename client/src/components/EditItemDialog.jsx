import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const EditItemDialog = ({
  openDialog,
  handleDialogClose,
  currentItem,
  setCurrentItem,
  handleDialogUpdate,
  updateItemLoading,
}) => {
  return (
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
        <TextField
          autoFocus
          margin="dense"
          id="unit"
          label="unit"
          type="text"
          fullWidth
          variant="standard"
          value={currentItem?.unit}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, unit: e.target.value })
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
  );
};

EditItemDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  currentItem: PropTypes.object.isRequired,
  setCurrentItem: PropTypes.func.isRequired,
  handleDialogUpdate: PropTypes.func.isRequired,
  updateItemLoading: PropTypes.bool.isRequired,
};

export default EditItemDialog;
