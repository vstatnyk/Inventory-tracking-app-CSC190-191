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
  const [Quantity, setQuantity] = useState(null);

  const handleQuantityChange = (newValue) => {
    setQuantity(newValue);
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      console.log(id);
      const data = await getItem(id, localStorage.getItem("token"));
      setItem(data);
      setQuantity(data.quantity + " " + data.unit);
      console.log(data);
    };

    fetchData();
  }, [id]); // Only re-run the effect if `id` changes

  return (
    <>
      <Nav></Nav>
      {/* name: Testing description: Testing Description quantity: 65 __v: 0 */}
      {Item && (
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
            <div>{Item.name}</div>
            <div>{Item.description}</div>
            <div>{Quantity}</div>
          </CardContent>
          <CardActions sx={{ margin: "auto" }}>
            <CheckInOutDialog
              buttonName="Check In"
              item={Item}
              quantity={Quantity}
              handleQuantityChange={handleQuantityChange}
              checkIn={true}
            ></CheckInOutDialog>
            <CheckInOutDialog
              buttonName="Check Out"
              item={Item}
              quantity={Quantity}
              handleQuantityChange={handleQuantityChange}
              checkIn={false}
            ></CheckInOutDialog>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default CheckInOut;
