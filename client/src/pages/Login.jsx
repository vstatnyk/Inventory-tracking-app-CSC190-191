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
import Modal from "@mui/material/Modal";

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
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        alert("Password reset email sent!");
        handleCloseModal();
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
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
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
          <Button onClick={handleOpenModal}>Forgot Password?</Button>
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <h2>Reset Password</h2>
              <TextField
                label="Email"
                variant="outlined"
                value={resetEmail}
                onChange={handleResetEmailChange}
              />
              <Button onClick={handleResetPassword}>Send Reset Email</Button>
            </Box>
          </Modal>
          {errorMessage && <Box sx={{ color: "red" }}>{errorMessage}</Box>}
        </Box>
      </form>
    </>
  );
}
