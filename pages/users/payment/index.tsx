import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
type PaymentInfo = {
  payment_info_id: number;
  card_id: string;
  payment_name: string;
  payment_method: string;
  prompt_pay: number;
  expired_date: string;
  user_id: number;
}
export default function PaymentMethod() {
  const [userPayment, setUserPayment] = useState<PaymentInfo[]>([])
  const [open, setOpen] = useState(false)
  const session = useSession()
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const censorValue = (value: string) => {
    const visibleDigits = 4; // Number of visible digits at the end
    const maskedValue = '*'.repeat(value.length - visibleDigits) + value.slice(-visibleDigits);
    return maskedValue;
  };
  const router = useRouter()
  useEffect(() => {
    if(session.data?.user.user_id){
      console.log(session.data?.user.user_id)
      const user_id = session.data?.user.user_id;
  
      try {
        axios.get(
          `https://ticketapi.fly.dev/get_user_payment?user_id=${user_id}`
        ).then((res)=>{
          // console.log(res)
          setUserPayment(res.data)
        })
        // setUserPayment(userPayment)
      } catch (error) {
        console.log(error)        
      }

    }
    
  }, [])
  
  // console.log(userPayment)
  const handleDelete = (payment_info_id: number) =>{
    axios.delete(`https://ticketapi.fly.dev/delete_user_payment?payment_info_id=${payment_info_id}`).then(()=>{
      setUserPayment(userPayment => userPayment.filter(obj => obj.payment_info_id !== payment_info_id))
      handleClose()
      }
    )
  }

  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-6">Payment</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div className="pl-10 w-full">
            <div className="flex justify-end mb-4">
              <Button onClick={()=>{router.push("/users/payment/add")}} variant="contained" color="primary" style={{ backgroundColor: '#E90064' }}>Add New Payment</Button>
            </div>
            <div className="flex flex-col ">
              {userPayment.length == 0 &&
              <div className="flex flex-col justify-center items-center mt-20">
                <h2 className="text-md">No Payment information</h2>
                <h1 className="font-semibold text-2xl text-[#060047]">Please add new payment</h1>
              </div>
              }
              {userPayment && userPayment.map((payment)=>{
                if(payment.payment_method == "Credit Card"){
                  return (
                      <div className="flex shadow-lg bg-gray-100 p-4 w-full rounded-md mb-4 justify-between">
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
                        <div className="flex">
                          <img className="mr-12" src="/masterCardIcon.svg" alt="" width={100} height={100} />
                          <div className="flex flex-col">
                            <h4 className="text-sm font-light">Credit/Debit Card</h4>
                            <h2 className="text-3xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                            <h3 className="text-xl">{censorValue(payment.card_id.toString())}</h3>
                            <h3 className="text-sm">expired date: {payment.expired_date.split('T')[0]}</h3>
                          </div>
                        </div>
                        <Button onClick={handleClickOpen} variant="text" startIcon={<DeleteIcon />} style={{ color: '#E90064' }}>
                          Delete
                        </Button>
                      </div>
                  )
                }
                if(payment.payment_method == "Prompt Pay"){
                  return (
                      <div className="flex shadow-lg bg-gray-100 p-4 w-full rounded-md mb-4 justify-between">
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
                        <div className="flex">
                          <img className="mr-12" src="/promptPayIcon.svg" alt="" width={100} height={100} />
                          <div className="flex flex-col">
                            <h4 className="text-sm font-light">Prompt Pay</h4>
                            <h2 className="text-3xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                            <h3 className="text-xl">{censorValue(payment.prompt_pay.toString())}</h3>
                          </div>
                        </div>
                        <Button onClick={handleClickOpen} variant="text" startIcon={<DeleteIcon />} style={{ color: '#E90064' }}>
                          Delete
                        </Button>
                      </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   // console.log("test", session)

// };