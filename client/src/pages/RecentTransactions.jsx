import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { getTransactions } from "../utils/api";
import { CheckLoginStatus } from "../functions/CheckLoginStatus";


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

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions(localStorage.getItem("token"));
      console.log(data);
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <>
      {CheckLoginStatus() === true ? (
        <div style={{ color: "black" }}>
          <h1>Recent Transactions</h1>
          <Nav active="recent" />
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
      ) : (
        <></> // CheckLoginStatus() is false
      )}
    </>
  );
}
