import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/system";

const StyledTextField = styled(TextField)({
  marginTop: "10px",
  marginBottom: "8px",
});

const AddItemDialog = ({
  openAddDialog,
  handleAddDialogClose,
  formData,
  handleInputChange,
  handleAddItem,
}) => {
  return (
    <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        Add Item
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          variant="outlined"
          color="primary"
          type="text"
          fullWidth
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          InputProps={{
            style: {
              color: "black",
            },
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Quantity"
          variant="outlined"
          color="primary"
          type="text"
          fullWidth
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          InputProps={{
            style: {
              color: "black",
            },
          }}
        />
        <StyledTextField
          autoFocus
          label="Department"
          variant="outlined"
          fullWidth
          id="department"
          select
          name="department"
          margintop="20px"
          value={formData.department}
          onChange={handleInputChange}
          InputProps={{
            style: {
              color: "black",
            },
          }}
        >
          <MenuItem value="office">Office</MenuItem>
          <MenuItem value="finance">Finance</MenuItem>
          <MenuItem value="public outreach">Public Outreach</MenuItem>
          <MenuItem value="lab">Lab</MenuItem>
          <MenuItem value="operations">Operations</MenuItem>
          <MenuItem value="shop">Shop</MenuItem>
          <MenuItem value="fisheries">Fisheries</MenuItem>
          <MenuItem value="it">It</MenuItem>
        </StyledTextField>
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          variant="outlined"
          color="primary"
          type="text"
          fullWidth
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          InputProps={{
            style: {
              color: "black",
            },
          }}
        />
      </DialogContent>
      <center>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleAddItem} color="primary" autoFocus>
            OK
          </button>
          <button onClick={handleAddDialogClose} color="primary">
            Cancel
          </button>
        </DialogActions>
      </center>
    </Dialog>
  );
};

AddItemDialog.propTypes = {
  openAddDialog: PropTypes.bool.isRequired,
  handleAddDialogClose: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
};

export default AddItemDialog;
