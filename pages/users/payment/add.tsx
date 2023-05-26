
import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import React, { useEffect } from "react";
import { Alert, Collapse, TextField, Button, MenuItem, Select, FormControl, ToggleButtonGroup, ToggleButton, IconButton}  from '@mui/material';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle}  from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

interface dateType {
    $D : number;
    $H : number;
    $L : string;
    $M : number;
    $W : number;
    $d : Date;
    $m : number;
    $ms : number;
    $s : number;
    $u : number;
    $xn : number;
    $y : number;
}

export default function PaymentMethod() {
    const [cardNumber, setCardNumber] = useState<string>("")
    const [cardName, setCardName] = useState("")
    const [expireDate, setExpireDate] = useState< dateType| string >("")
    const [CVV, setCVV] = useState("")
    const [missing, setMissing] = useState<string[]>([])
    const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card")
    const [promptPay, setpromptPay] = useState<string>("")
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")
    const [alert, setAlert] = useState("success")
    const {data: session} = useSession()
    const router = useRouter()
    useEffect(() => {
        if(missing.length > 0 ){
        setOpen(true)
        }
    }, [missing])

    const handlePaymentMethod = (event: Event, newMethod: string) => {
        setPaymentMethod(newMethod);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setMissing([])
        let missingValue: string[] = []
        if(cardName.length == 0){
            missingValue.push("Payment Name")
        }
        let body
        if(paymentMethod == "Credit Card"){
            body = {
                "user_id": session?.user?.user_id,
                "card_id": parseInt(cardNumber),
                "payment_name": cardName,
                "payment_method": paymentMethod,
                "expired_date": expireDate.$d && new Date(expireDate.$d).toISOString().split('T')[0] || expireDate
            }
            if(cardNumber.length == 0){
                missingValue.push("Card Number")
            }
            if(CVV.length == 0){
                missingValue.push("CVV")
            }
            if(typeof(expireDate) == "string" && expireDate.length == 0){
                missingValue.push("Expire Date")
            }
        }        
        if(paymentMethod == "Prompt Pay"){
            body = {
                "user_id": session?.user?.user_id,
                "payment_method": paymentMethod,
                "payment_name": cardName,
                "prompt_pay": promptPay
            }
            if(promptPay.length == 0){
                missingValue.push("Prompt Pay")
            }            
        }
        setMissing(missingValue)

        if(missingValue.length == 0){
            try {
                axios
                .post('https://ticketapi.fly.dev/create_user_payment',
                body
                )                      
                .then((res)=>{
                    console.log(res)
                    if(res.status == 200){
                        setAlert('success')
                    }
                    if(res.status == 201){
                        setAlert('error')
                    }
                    setAlertMessage(res.data)
                    setAlertOpen(true)
                })
            } catch (error) {
                console.log(error)
            }
        }
        // console.log(body)
    }

    return (
        <main>
        <Dialog
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Please fill value in all field"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                There are missing value in {missing.join(", ")}            
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>{setOpen(false);}}>Close</Button>
            </DialogActions>
        </Dialog>
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
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <h2 className="text-xl">Let's Add Your</h2>
                    <h1 className="text-2xl font-semibold text-[#060047] mb-5">Payment Infomation</h1>
                    <ToggleButtonGroup
                        value={paymentMethod}
                        exclusive
                        onChange={handlePaymentMethod}
                        aria-label="text alignment"
                        >
                        <ToggleButton value="Credit Card" >
                            Credit Card
                        </ToggleButton>
                        <ToggleButton value="Prompt Pay" >
                            Prompt pay
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {
                        paymentMethod == "Credit Card" &&
                        <>
                        <div className="flex flex-col my-2">
                            <label htmlFor="">Card Number</label>
                            <TextField 
                            id="outlined-basic" 
                            value={cardNumber}
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                            }}
                            error={missing.includes("Card Number")}
                            onChange={(e)=>{
                                setCardNumber(e.target.value)
                            }}
                            sx={{width: "50ch"}}
                            variant="outlined" />
                        </div>
                        <div className="flex flex-col my-2">
                            <label htmlFor="">Payment Name</label>
                            <TextField 
                            id="outlined-basic" 
                            value={cardName}
                            error={missing.includes("Payment Name")}
                            onChange={(e)=>{
                                setCardName(e.target.value)
                            }}
                            sx={{width: "50ch"}}
                            variant="outlined" />
                        </div>
                        <div className="flex my-2">
                            <div className="flex flex-col mr-12">
                            <label htmlFor="">Expired Date</label> 
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                value={expireDate}
                                error={missing.includes("Expire Date")}
                                onChange={(e)=>{
                                    // console.log(e)
                                    setExpireDate(e)
                                }}
                                sx={{width: "25ch"}} 
                                />
                            </LocalizationProvider>
                            </div>
                            <div className="flex flex-col ">
                                <label htmlFor="">CVV</label>
                                <TextField 
                                id="outlined-basic" 
                                value={CVV}
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                    maxLength: 3,
                                }}
                                error={missing.includes("CVV")}
                                onChange={(e)=>{
                                    setCVV(e.target.value)
                                }}
                                sx={{width: "20ch"}}
                                variant="outlined" />
                            </div>
                        </div>      
                        </>
                    }
                    {
                        paymentMethod == "Prompt Pay" &&
                        <>
                            <div className="flex flex-col my-2">
                                <label htmlFor="">Payment Name</label>
                                <TextField 
                                id="outlined-basic" 
                                value={cardName}
                                error={missing.includes("Payment Name")}
                                onChange={(e)=>{
                                    setCardName(e.target.value)
                                }}
                                sx={{width: "50ch"}}
                                variant="outlined" />
                            </div>
                            <div className="flex flex-col my-2">
                                <label htmlFor="">Prompt Pay Number</label>
                                <TextField 
                                id="outlined-basic" 
                                value={promptPay}
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                error={missing.includes("Prompt Pay")}
                                onChange={(e)=>{
                                    setpromptPay(e.target.value)
                                }}
                                sx={{width: "50ch"}}
                                variant="outlined" />
                            </div>
                        </>
                    }
                    <Collapse in={alertOpen}>
                        <Alert
                        severity={alert}
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlertOpen(false);
                            }}
                            >
                                x
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                            {alertMessage}
                        </Alert>
                </Collapse>
                <div className="flex ml-[30ch]  my-2">
                    <Button className="mr-4" type="submit" variant="outlined" color="primary" onClick={()=>{router.back()}}>Back</Button>
                    <Button type="submit" variant="contained" color="primary" style={{ backgroundColor: '#E90064' }}>Add!</Button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </main>
    );
}
