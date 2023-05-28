import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import { Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

export default function Setting() {
  const { data: session, status, update: update } = useSession();
  const user_id = session?.user.user_id
  const [name, setName] = useState([])
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [DOB, setDOB] = useState("")
  const [gender, setGender] = useState('');
  const [open, setOpen] = useState(false);
  const [missing, setMissing] = useState<string[]>([])
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [alert, setAlert] = useState("success")
  const [edit, setEdit] = useState("false")

  console.log(session)

  useEffect(() => {
    if(session?.user){
      // console.log())
      const {f_name, l_name, email, DOB, gender, tel} = session.user
      setName([f_name, l_name])
      setPhone(tel)
      setDOB(dayjs(DOB))
      setEmail(email)
      setGender(gender)
    }
  }, [session])
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMissing([])
    let missingValue: string[] = []
    const body = {
      "f_name": name[0],
      "l_name": name[1],
      "gender": gender,
      "email": email,
      "tel": phone,
      "DOB": DOB.$d && dayjs(DOB.$d).format('YYYY-MM-DD') || DOB
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
        const response = await axios.put(
          `https://ticketapi.fly.dev/update_user/${user_id}`,
          body,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          ).then((res)=>{
              if(res.status == 200){
                  setAlert('success')
              }
              if(res.status == 201){
                  setAlert('error')
              }
              setAlertMessage(res.data)
              setAlertOpen(true)
            update({user:{
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
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-6">Account Settings</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div className="pl-10 w-full">
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
              <h1 className="text-3xl font-semibold text-[#060047]">Account Setting</h1>
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
                          onChange={(e)=>{
                            console.log(dayjs(e.$d).format('YYYY-MM-DD'))
                            setDOB(e)
                          }}
                          sx={{width: "25ch"}} 
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
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
                  <Button className="ml-auto my-2" type="submit" variant="contained" color="primary" style={{ backgroundColor: '#E90064' }}>Save</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
