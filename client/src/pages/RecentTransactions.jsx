import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { getTransactions, deleteAllTransactions } from "../utils/api";

//styles for MUI components
const AccordionStyle = {
  justifyContent: "center",
  height: "auto",
  width: "95%",
  margin: "auto",
  backgroundColor: "#7f7f7f",
  color: "white",

  // style for when accordion is expanded
  "&.Mui-expanded": {
    justifyContent: "center",
    height: "auto",
    width: "95%",
    margin: "auto",
    backgroundColor: "#7f7f7f",
    color: "white",
  },
};

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions(localStorage.getItem("token"));
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("token");
    await deleteAllTransactions(token);
    setTransactions([]);
  };

  return (
    <>
      <div style={{ color: "black" }}>
        {/* <h1>Recent Transactions</h1> */}
        <Nav active="recent" />
        <Button
          variant="contained"
          onClick={handleOpenModal}
          style={{ marginBottom: "10px" }}
        >
          Delete All
        </Button>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete all transactions? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={async () => {
                await handleDeleteAll();
                handleCloseModal();
              }}
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {transactions.map((transaction) => (
          <Accordion key={transaction._id} sx={AccordionStyle}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div>{new Date(transaction.date).toLocaleString()}</div>
            </AccordionSummary>
            <AccordionDetails>
              <div>User: {transaction.userEmail}</div>
              <div>Product: {transaction.productName}</div>
              <div>Quantity: {transaction.quantity}</div>
              <div>Description: {transaction.description}</div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
}
