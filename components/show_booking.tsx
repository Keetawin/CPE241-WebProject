import { useState } from 'react';
import { getSession, useSession } from "next-auth/react";
import DeleteIcon from '@mui/icons-material/Delete';
import Link from "next/link";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";

type Props = {
    bookingid: string;
    img: string;
    eventName: string;
    price: string;
    quantity: string;
  };
  

  
  export default function booking({ bookingid, img, eventName, price, quantity }) {
    const [isRefund, setIsRefund] = useState(false);
    const [open, setOpen] = useState(false)
    const session = useSession()
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleRefund = (ticketid: number) => {
        axios.put(`https://ticketapi.fly.dev/refund_ticket/${ticketid}`).then(() => {
          setIsRefund(true);
          handleClose()
        });
      };
  
    return (
        <main>
                    <div className="flex justify-center mt-8" >
                    <div className="flex flex-col w-full">
                        <div className="border-2 border-[#060047] w-full h-50 flex">
                        <div className="align-middle items-center">
                            <img
                            className="h-full w-36 object-cover object-center"
                            src={img}
                            alt="Your Image Alt Text"
                            />
                        </div>
                        <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
                            <p>{eventName}</p>
                            <p className="font-medium text-sm">{price}</p>
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


                                <div className="border-2 border-[#060047] w-full h-50 flex">
                                    <div className="align-middle items-center">
                                        <img
                                        className="h-full w-36 object-cover object-center"
                                        src={img}
                                        alt="Your Image Alt Text"
                                        />
                                    </div>
                                    <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
                                        <p>{eventName}</p>
                                        <p className="font-medium text-sm">{location}</p>
                                        <p className="font-medium text-sm">Event Date: {eventStart} - {eventEnd}</p>
                                    </div>
                                </div>
                                



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