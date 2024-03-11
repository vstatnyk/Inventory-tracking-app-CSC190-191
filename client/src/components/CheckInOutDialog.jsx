import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { updateItem } from "../utils/api";
import AlertPopUp from "./AlertPopUp";

function MyDialog(props) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState([]);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
    }
  }, [showAlert]);

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
          props.item.quantity + Number(quantity),
          props.item.department,
          localStorage.getItem("token")
        );
        props.item.quantity = props.item.quantity + Number(quantity);

        setAlert(["success", "success"]);
        setShowAlert(true);
      } catch (error) {
        setAlert(["Error updating item: " + error.message, "error"]);
        setShowAlert(true);
        console.error("Error updating item:", error.message);
      }
      setOpen(false);
    } else {
      setAlert(["Quantity must not be empty and be greater than 0", "info"]);
      setShowAlert(true);
      // alert();
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
      {showAlert && (
        <div>
          <AlertPopUp message={alert[0]} type={alert[1]} />
        </div>
      )}
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
