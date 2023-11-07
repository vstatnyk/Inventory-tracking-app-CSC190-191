import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          {errorMessage && <Box sx={{ color: "red" }}>{errorMessage}</Box>}
        </Box>
      </form>
    </>
  );
}
