import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
import dayjs from "dayjs";

type Props = {
  ticketid: string;
  eventid: string;
  img: string;
  eventName: string;
  location: string;
  eventStart: string;
  eventEnd: string;
  refund: string;
  isrefund: string;
};

export default function ShowTicket({
  ticketid,
  eventid,
  img,
  eventName,
  location,
  eventStart,
  eventEnd,
  refund,
  eventType,
  seatType,
  seatNo
}) {
  const [isRefund, setIsRefund] = useState(false);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRefund = (ticketid: number) => {
    axios
      .put(`https://ticketapi.fly.dev/refund_ticket/${ticketid}`)
      .then(() => {
        setIsRefund(true);
        handleClose();
      });
  };

  return (
    <main>
      <div className="flex justify-center mt-8">
        <div className="flex flex-col w-full">
          <div className="w-full h-50 flex bg-[#131724] drop-shadow-md text-white">
            <div className="align-middle items-center">
              <img
                className="h-full w-40 object-cover object-center"
                src={img}
                alt="Your Image Alt Text"
              />
            </div>
            <div className="px-4 text-lg py-8 flex flex-col ml-8">
              <h2 className="text-2xl font-semibold ">{seatType}</h2>
              <h2 className="text-md text-[#E90064]"><EventSeatIcon className="mr-5"/>Seat NO. {seatNo}</h2>
              <h3 className="text-xl font-semibold mt-4">{eventName}</h3>
              <p className="font-light text-sm">
              <CalendarMonthIcon className="mr-5"/>
                Event Date: {dayjs(eventStart).format("DD/MM/YYYY")} - {dayjs(eventEnd).format("DD/MM/YYYY")}
              </p>
              <p className="font-regular text-sm"><LocationOnIcon className="mr-5"/>Location</p>
              <p className="font-light text-sm ml-10">{location}</p>
            </div>
            <div className="flex flex-col px-4 py-8 gap-4 ml-auto bg-white">
              <Link
                href={{ pathname: "/events/[id]", query: { id: eventid } }}
                key={eventid}
              >
                <button className="bg-[#060047] text-sm text-white font-semibold py-2 px-6 rounded-md">
                  View Ticket
                </button>
              </Link>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Delete this payment information?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    delete this payment information permarnently
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancle</Button>
                  <Button
                    onClick={() => handleRefund(ticketid)}
                    autoFocus
                    style={{ color: "#E90064" }}
                  >
                    Refund
                  </Button>
                </DialogActions>
              </Dialog>

              {refund && (
                <Button
                  onClick={handleClickOpen}
                  variant="text"
                  startIcon={<DeleteIcon />}
                  style={{ color: "#E90064", marginTop: "10px" }}
                >
                  refund
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
