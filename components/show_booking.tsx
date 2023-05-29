import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

type Props = {
  bookingid: string;
  img: string;
  eventName: string;
  totalprice: string;
  quantity: string;
  tickets: Ticket[]; // Add tickets prop
};

type Ticket = {
  ticket_id: string;
  booking_id: string;
  ticket_date: string;
  ischeckin: boolean;
  isrefund: boolean;
  refundable: boolean;
  seat_no: string;
  seat_type_id: number;
  seat_type: string;
  price: string;
};

export default function booking({
  bookingid,
  img,
  eventName,
  totalprice,
  quantity,
<<<<<<< HEAD
  eventType
}) {
=======
  tickets, // Add tickets prop
}): JSX.Element {
>>>>>>> b536ee839999b3e1c21da34cbac5a975c493b0c6
  const [isRefund, setIsRefund] = useState(false);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <main>
      <div className="flex justify-center mt-8 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full h-50 flex bg-white drop-shadow-md">
            <div className="align-middle items-center">
              <img
                className="h-full w-40 object-cover object-center"
                src={img}
                alt="Your Image Alt Text"
              />
            </div>
<<<<<<< HEAD
            <div className="px-4 py-8  flex flex-col ml-8">
              <h5 className="text-md font-light">Order #{bookingid}</h5>
              <h2 className="text-md text-[#E90064] text-md">{eventType}</h2>
              <h3 className="font-semibold text-2xl">{eventName}</h3>
              <p className="font-medium text-sm">Price: {price}</p>
=======
            <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
              <p>{eventName}</p>
              <p className="font-medium text-sm">Total Price: {totalprice}</p>
>>>>>>> b536ee839999b3e1c21da34cbac5a975c493b0c6
              <p className="font-medium text-sm">Quantity : {quantity}</p>
            </div>
            <div className="flex flex-col px-4 py-8 gap-4 ml-auto">
              <Link
                href={{ pathname: "/user/[id]", query: { id: bookingid } }}
                key={bookingid}
              >
                <button className="bg-[#060047] text-sm text-white font-semibold py-2 px-6 rounded-md">
                  Comfirm Payment
                </button>
              </Link>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Ticket in this Transaction"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                  {tickets.map((ticket) => (
                      <div key={ticket.ticket_id} className="border-2 border-[#060047] w-full h-50 flex"
                      style={{ marginTop: '20px' }}
                      >
                        <div className="align-middle items-center">
                          <img
                            className="h-full w-36 object-cover object-center"
                            src={img}
                            alt="Your Image Alt Text"
                          />
                        </div>
                        <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
                          <p>{eventName}</p>
                          <p className="font-medium text-sm">Seat Type: {ticket.seat_type}</p>
                          <p className="font-medium text-sm">Seat No: {ticket.seat_no}</p>
                          <p className="font-medium text-sm">Price: {ticket.price}</p>
                        </div>
                      </div>
                    ))}
                                
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
              <Button
                onClick={handleClickOpen}
                variant="text"
                className="bg-[#060047] text-sm text-white font-semibold py-2 px-6 rounded-md"
              >
                Show data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}