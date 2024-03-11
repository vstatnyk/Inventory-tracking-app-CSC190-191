import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CheckInOutDialog from "../components/CheckInOutDialog";
import Nav from "../components/Nav";
import { getItem } from "../utils/api";

const CheckInOut = () => {
  const [Item, setItem] = useState(null);

  const { id } = useParams();
  console.log(id);
  const item = getItem(
    "65eb4f737978686763768115",
    localStorage.getItem("token")
  );
  console.log(item);

  useEffect(() => {
    const fetchItems = async () => {
      // console.log(localStorage.getItem("token"));
      try {
        const item = await getItem(
          "65eb4f737978686763768115",
          localStorage.getItem("token")
        );
        console.log(item);
        setItem(item);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };
    fetchItems();
    // console.log(id);
  }, [id]);

  return (
    <>
      <Nav></Nav>
      name: Testing description: Testing Description quantity: 65 __v: 0
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          width: 600,
          maxWidth: "75%",
          border: "1px solid black",
          height: 500,
        }}
      >
        <CardMedia sx={{ height: 300 }} image="/react.svg" title="images" />
        <CardContent>
          {/* {console.log(Item)} */}
          <div>{Item.name}</div>
          <div>{Item.description}</div>
          <div>{Item.quantity}</div>
        </CardContent>
        <CardActions sx={{ margin: "auto" }}>
          <CheckInOutDialog
            buttonName="Check In"
            item={Item}
          ></CheckInOutDialog>
          <CheckInOutDialog
            buttonName="Check Out"
            item={Item}
          ></CheckInOutDialog>
        </CardActions>
      </Card>
    </>
  );
};

export default CheckInOut;
