import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { getTransactions } from "../utils/api";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions(localStorage.getItem("token"));
      console.log(data);
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ color: "black" }}>
      <h1>Recent Transactions</h1>
      <Nav active="recent" />
      {transactions.map((transaction) => (
        <Accordion key={transaction._id}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{new Date(transaction.date).toLocaleString()}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>User: {transaction.userEmail}</Typography>
          <Typography>Product: {transaction.productName}</Typography>
          <Typography>Quantity: {transaction.quantity}</Typography>
          <Typography>Description: {transaction.description}</Typography>
        </AccordionDetails>
      </Accordion>
      ))}
    </div>
  );
}
