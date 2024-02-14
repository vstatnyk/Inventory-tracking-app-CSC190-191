import {
  TextField, 
  InputAdornment,
  IconButton,
  MenuItem
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import React, { useState } from 'react';
import { registerUser } from "../utils/api";

const AddAccountDialog = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
    department: ''
  });

  const handleAddAccount = async () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event) => {
    var role = 1;
    if (formData.role === "admin") {
        role = 4;
    } else if (formData.role === "manager") {
      role = 3;
    } else if (formData.role === "supervisor") {
      role = 2;
    }
    await registerUser(
      formData.email,
      formData.password,
      role,
      localStorage.getItem('token')
    );
    setIsFormOpen(false);
    window.location.reload();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <button onClick={handleAddAccount}>Add Account</button>
      <div>
      <Dialog open={isFormOpen} onClose={closeForm}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          Add Account
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            label="Email"
            variant="outlined"
            color="primary"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          />
          <StyledTextField
            label="Password"
            variant="outlined"
            fullWidth
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    sx={showPasswordStyle}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Role"
            variant="outlined"
            fullWidth
            id="role"
            select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          >
          <MenuItem value="employee">Employee</MenuItem>
          <MenuItem value="supervisor">Supervisor</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </StyledTextField>
        <StyledTextField
            label="Department"
            variant="outlined"
            fullWidth
            id="department"
            select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          >
          <MenuItem value="department1">Department 1</MenuItem>
          <MenuItem value="department2">Department 2</MenuItem>
          </StyledTextField>
        </DialogContent>
        <center>
          <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleFormSubmit} color="primary" autoFocus>
              OK
            </button>
            <button onClick={closeForm} color="primary">
              Cancel
            </button>
          </DialogActions>
        </center>
      </Dialog>
    </div>
    </div>
  );
};

const StyledTextField = styled(TextField)({
  margin: "10px",
  width: "90%",
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
  }
});

const showPasswordStyle = {
  justifyItems: "center",
  color: "black",
  "&:focus": {
    outline: "none",
  },
  "&:hover": {
    backgroundColor: "#323235",
  },
};

export default AddAccountDialog;