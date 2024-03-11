import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function AlertPopUp({ message, type }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="popup-container">
      <Slide direction="down" in={show} mountOnEnter unmountOnExit>
        <Alert variant="filled" severity={type} onClose={() => setShow(false)}>
          {message}
        </Alert>
      </Slide>
    </div>
  );
}

AlertPopUp.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

