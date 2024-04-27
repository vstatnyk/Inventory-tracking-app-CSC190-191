import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { getItems } from "../utils/api";

const QRCodes = () => {
  const [Items, setItems] = useState(null);
  const [qrcodes, setQrcodes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getItems(
        null,
        null,
        null,
        localStorage.getItem("token")
      );
      setItems(data);
      console.log(Items);

      const qrCodeData = {};
      Items.forEach((item) => {
        qrCodeData[item._id] = generateQRCode(item, String(item._id));
      });
      setQrcodes(qrCodeData);
    };

    fetchData();
  }, [Items]); // Only re-run the effect if `id` changes

  // useEffect(() => {

  const generateQRCode = (item, id) => {
    const qrCodeData = {
      url: item.url ? item.url : "http://localhost:5173/checkinout/" + id,
    };

    const qrCodeString = JSON.stringify(qrCodeData);
    return <QRCode value={qrCodeString} />;
  };

  return (
    <>
      <h1>QR Codes</h1>
      {Items &&
        Items.map((item) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              allignItems: "center",
              margin: "0px",
            }}
            key={item._id}
          >
            <div style={{ display: "inline-block" }}>{qrcodes[item._id]}</div>
            <div
              style={{
                color: "black",
                display: "inline-block",
                width: "100px",
                marginTop: "50px",
              }}
            >
              {item.name}
            </div>
          </div>
        ))}
    </>
  );
};

export default QRCodes;
