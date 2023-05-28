import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Frombox from "@/components/formbox";
import InputLabel from '@mui/material/InputLabel';
import { Alert, TextField, Button, MenuItem, Select, FormControl}  from '@mui/material';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle}  from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/router';

const Account = () => {
  const { data: session, status, update: update } = useSession();
  const [name, setName] = useState([])
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [DOB, setDOB] = useState("")
  const [gender, setGender] = useState('');
  const [open, setOpen] = useState(false);
  const [missing, setMissing] = useState([])
  const router = useRouter();

  useEffect(() => {
    if(session !== undefined){
      if(session.user.user_id !== undefined){
        router.back();
      }
      if(session.user !== undefined){
        setName(session.user.name.split(" "))
      }
      setEmail(session.user.email)
    }
  }, [session])
  useEffect(() => {
    if(missing.length > 0 ){
      setOpen(true)
    }
  }, [missing])
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === "visible" && update()
    window.addEventListener("visibilitychange", visibilityHandler, false)
    return () => window.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [update])
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMissing([])
    let missingValue = []
    const body = {
      "f_name": name[0],
      "l_name": name[1],
      "gender": gender,
      "email": email,
      "tel": phone,
      "DOB": DOB.$d && new Date(DOB.$d).toISOString().split('T')[0] || DOB
    }
    // console.log(event)    
    // console.log(body)    
    if(body.f_name.length == 0){
      missingValue.push("First name")
    }
    if(body.l_name.length == 0){
      missingValue.push("Last Name")
    }
    if(body.DOB.length == 0){
      missingValue.push("Date of Birth")
    }
    if(body.gender.length == 0){
      missingValue.push("Gender")
    }
    if(body.tel.length == 0){
      missingValue.push("Phone Number")
    }
    if(body.email.length == 0){
      missingValue.push("Email")
    }
    setMissing(missing=>[...missing, ...missingValue])
    if(missingValue.length == 0){
      console.log(body)
      try {
        const response = await axios.post(
          `https://ticketapi.fly.dev/create_user`,
          body,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          ).then((res)=>{
            update({user:{
              user: res.data.user_id,
              tel: body.tel,
              DOB: body.DOB,
              gender: body.gender,
              f_name: body.f_name,
              l_name: body.l_name        
            }})
        })
      } catch (error) {
        console.error(error);
      }
    }
    console.log(session)
  };

  return (
    <div className="flex flex-col items-center my-10">
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
      <h2 className="text-xl">Let's Create Your</h2>
      <h1 className="text-3xl font-semibold text-[#060047]">Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-[50%]">
          <div className="flex flex-col my-2">
            <label htmlFor="">Email</label>
            <TextField 
              id="outlined-basic" 
              sx={{width: "50ch", }}
              disabled
              value={email}
              variant="filled" 
              />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="">First Name</label>
            <TextField 
              id="outlined-basic" 
              sx={{width: "50ch", }}
              value={name[0]}
              error={missing.includes("First Name")}
              helperText={missing.includes("First Name") && "Please enter first name"}
              onChange={(e)=>{
                setName([e.target.value, name[1]])
              }}
              variant="outlined" />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="">Last Name</label>
            <TextField 
              id="outlined-basic" 
              value={name[1]}
              error={missing.includes("Last Name")}
              helperText={missing.includes("Last Name") && "Please enter Last name"}
              onChange={(e)=>{
                setName([ name[0], e.target.value])
              }}
              sx={{width: "50ch"}}
              variant="outlined" />
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="">Phone Number</label>
            <TextField 
              id="outlined-basic" 
              error={missing.includes("Phone Number")}
              helperText={missing.includes("Phone Number") && "Please enter Phone number"}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 10,
              }}
              value={phone}
              onChange={(e)=>{
                setPhone(e.target.value)
              }}
              sx={{width: "50ch"}}
              variant="outlined" />
          </div>
          <div className="flex my-2 items-start">
            <div className="flex flex-col mr-2 ">
              <label htmlFor="">Gender</label> 
              <FormControl sx={{ width: 240 }}>
                <Select
                  value={gender}
                  autoWidth={false}
                  error={missing.includes("Gender")}
                  onChange={(e)=>{setGender(e.target.value)}}
                  >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Date of Birth</label> 
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                  value={DOB}
                  error={missing.includes("Date of Birth")}
                  onChange={(e)=>{
                    console.log(new Date(e.$d).toISOString().split('T')[0])
                    setDOB(e)
                  }}
                  sx={{width: "25ch"}} 
                />
              </LocalizationProvider>
            </div>
          </div>
          <Button className="ml-auto translate-x-[-100%] my-2" type="submit" variant="contained" color="primary" style={{ backgroundColor: '#E90064' }}>Create!</Button>
      </form>
    </div>
  );
};

export default Account;

