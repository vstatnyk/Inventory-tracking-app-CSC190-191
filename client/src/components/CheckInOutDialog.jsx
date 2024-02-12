import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useState } from "react";
import { updateItem } from "../utils/api";

function MyDialog(props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handelQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (quantity >= 0 && quantity !== "") {
      try {
        await updateItem(
          props.item._id,
          props.item.name,
          props.item.description,
          quantity,
          localStorage.getItem("token")
        );
        props.item.quantity = quantity;
      } catch (error) {
        console.error("Error updating item:", error.message);
      }
      setOpen(false);
    } else {
      alert("Quantity must not be empty and be greater than 0");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button onClick={handleClickOpen}>{props.buttonName}</button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props.buttonName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How much of this item would you like to {props.buttonName}?
            <br />
            Available quantity: {props.item.quantity}
          </DialogContentText>
          <br />
          <StyledTextField
            label="Quantity"
            variant="outlined"
            fullWidth
            color="primary"
            id="quantity"
            value={quantity}
            onChange={handelQuantityChange}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} color="primary">
            Cancel
          </button>
          <button onClick={handleSubmit} color="primary" autoFocus>
            OK
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

MyDialog.propTypes = {
  buttonName: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

// custom components for this file
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "black",
  },
  "& .MuiInputLabel-root": {
    color: "black",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
});

export default MyDialog;
