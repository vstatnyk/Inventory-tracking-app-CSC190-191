import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../images/mosqeet.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

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

export default function Login() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState({ status: null, error: null });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleExitedDialog = () => {
    setResetStatus({ status: null, error: null });
    setResetEmail("");
  };

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus({ status: "success", error: null });
    } catch (error) {
      console.error("Error:", error);
      setResetStatus({ status: "error", error: error.message });
    }
  };

  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      navigate("/inventory");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (isAuthenticated) {
      navigate("/inventory");
    }
  }, [navigate]);

  return (
    <>
      <div>
        <img src={logo} />
      </div>
      <h1>Login</h1>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <StyledTextField
            label="Email"
            variant="outlined"
            fullWidth
            color="primary"
            id="username"
            value={email}
            onChange={handleUsernameChange}
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    sx={{
                      color: "black",
                      "&:focus": {
                        outline: "none",
                      },
                      "&:hover": {
                        backgroundColor: "#323235",
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            color="primary"
            onClick={handleOpenDialog}
            sx={{
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password?
          </Typography>
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            onTransitionExited={handleExitedDialog}
          >
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
              {resetStatus.status === "success" ? (
                <Typography color="green">
                  Password reset email sent!
                </Typography>
              ) : resetStatus.status === "error" ? (
                <Typography color="red">{resetStatus.error}</Typography>
              ) : (
                <>
                  <DialogContentText>
                    To reset your password, please enter the email address
                    associated with your account. We will send you an email with
                    instructions on how to reset your password.
                  </DialogContentText>
                  <TextField
                    onChange={handleResetEmailChange}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                </>
              )}
              <DialogActions>
                {resetStatus.status === null ? (
                  <>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleResetPassword}>Submit</Button>
                  </>
                ) : (
                  <Button onClick={handleCloseDialog}>Close</Button>
                )}
              </DialogActions>
            </DialogContent>
          </Dialog>
          {errorMessage && <Box sx={{ color: "red" }}>{errorMessage}</Box>}
        </Box>
      </form>
    </>
  );
}
