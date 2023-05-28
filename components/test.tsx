import { useState } from 'react';
import { getSession, useSession } from "next-auth/react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type Props = {
    img: string;
    eventName: string;
    location: string;
    eventDate: string;
  };
  

  
  export default function Test({ img, eventName, location, eventDate }) {
    const [open, setOpen] = useState(false)
    const session = useSession()
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleDelete = (payment_info_id: number) =>{

      }
  
    return (
        <main>
                {new Date(eventDate) >= new Date() && (
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
                            <p className="font-medium text-sm">{location}</p>
                            <p className="font-medium text-sm">Event Date: {eventDate}</p>
                        </div>
                        <div className="flex flex-col px-4 py-8 gap-4 ml-auto">
                            <button className="bg-[#060047] text-sm text-white font-semibold py-2 px-6 rounded-md">
                            View Ticket
                            </button>
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
                                <Button onClick={()=>handleDelete(payment.payment_info_id)} autoFocus style={{ color: '#E90064' }}>
                                Delete
                                </Button>
                            </DialogActions>
                            </Dialog>
                            <Button onClick={handleClickOpen} variant="text" startIcon={<DeleteIcon />} style={{ color: '#E90064' }}>
                                Delete
                            </Button>
                        </div>
                        </div>
                    </div>
                </div>
                )}
            </main>
      );
    }