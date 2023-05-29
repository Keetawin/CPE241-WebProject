import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Alert, Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, IconButton, MenuItem, Paper, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PaymentSelect from "@/components/payment_select";

const CheckoutPage = ({event, available_seat, userPayment}: Props) => {
  const router = useRouter();
  const { id, ticketType } = router.query;
  const parsedTicketType = JSON.parse(ticketType);
  const { data: session } = useSession();
  let totalQuantity = 0
  if (parsedTicketType && Array.isArray(parsedTicketType)) {
    totalQuantity = parsedTicketType.reduce((sum, element) => sum + element.quantity, 0);
  }

  const [voucherData, setVoucherData] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [ticket, setTicket] = useState([])

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [alert, setAlert] = useState("success")

  const [billing, setBilling] = useState({subTotal: 0, refundDown: 0, grandTotal: 0, voucher: 0})
  console.log(ticket);

  useEffect(() => {
      if (ticketType && typeof ticketType === "string") {
        if (Array.isArray(parsedTicketType) && ticket.length != totalQuantity) {
          let tickets = []
          parsedTicketType.forEach(element => {
            for (let i = 1; i <= element.quantity; i++) {
              tickets.push(              {
                  ticket_date: "",
                  refundable: false,
                  seat_no: "",
                  seat_type_id: element.seat_type_id
                }
              );
            }
          })
          setTicket(tickets)
      }
    }
  }, []);
  
  useEffect(()=>{
    let subTotal = 0
    let refundDown = 0
    let grandTotal = 0
    let voucher = 0 
    if(voucherData.voucher_is_valid){
      voucher = parseInt(voucherData.amount)
    }
    ticket.forEach((t, idx)=>{
      const ticket_info = parsedTicketType.find(type => type.seat_type_id === t.seat_type_id)
      subTotal += parseInt(ticket_info.price)*1.07
      if(t.refundable){
        refundDown += parseInt(ticket_info.price)*1.07*0.3
      }
    })
    grandTotal = subTotal + refundDown - voucher
    setBilling({
      subTotal: subTotal,
      refundDown: refundDown,
      grandTotal: grandTotal,
      voucher: voucher
    })

  }, [ticket, voucherData])

  const selectedTickets = ticketType ? JSON.parse(ticketType) : [];


  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    let body = {
      "user_id": session?.user?.user_id,
      "payment_info_id": selectedPayment,
      "event_id": id,
      "quantity": ticket.length,
      "tickets": ticket
    }   
    if(voucherData.voucher_is_valid){
      body["voucher_id"] = voucherData.voucher_id
    }
    axios.post("https://ticketapi.fly.dev/create_booking", body)
    router.push("/users")
    // console.log(body)
  };

  const handleVoucherRedeem = () => {
    if (voucherCode) {
      axios
        .get(
          `https://ticketapi.fly.dev/validate_voucher?event_id=${id}&voucher_code=${voucherCode}`
        )
        .then((res) => {
            setVoucherData(res.data);
            if(res.status == 200){
                setAlert('success')
            }
            setAlertMessage(res.data.info)
            setAlertOpen(true)
          })
          .catch((error) => {
            // console.log(error)
            setAlert('error')
            setVoucherData(error.response.data);
            setAlertMessage(error.response.data.info)
            setAlertOpen(true)
        });
    }
  };


  return (
    <div className="container mx-auto px-10">
      <div className="flex p-5 my-5 shadow-lg rounded-lg w-full overflow-hidden ">
        <div className="relative h-[250px]">
          {event.poster && 
            <img
              className="w-full h-full object-cover object-center rounded-t-lg aspect-w-4 aspect-h-3"
              src={event.poster}
              alt="Placeholder"
            />
          }
          {
            !event.poster &&
            <div className="flex w-full h-full bg-gradient-to-r from-[#b7175c] to-[#E90064] justify-center items-center text-center rounded-t-lg">
              <h1 className="text-white font-bold text-4xl rotate-[-12deg] skew-x-12">
                {event.event_name}
              </h1>
            </div>
          }
        </div>

        <div className="p-4 flex ml-10">
          <div className="">
            <h5 className="text-red-500">{event.event_type}</h5>
            <h2 className="text-4xl font-semibold mb-3">{event.event_name}</h2>
            <h3 className="text-gray-500 text-sm font-medium mb-3">Date: {dayjs(event.event_startdate).format("DD/MM/YYYY")} - {dayjs(event.event_enddate).format("DD/MM/YYYY")}</h3>
            <p className=" text-md mb-2"><LocationOnIcon/>Location: {event.location}</p>
            <p className=" text-md ">{event.event_description}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold py-4">Ticket</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
        <ul>
          {selectedTickets.map((ticket, index) => {
            if (ticket.quantity !== 0) {
              return (
                <li
                key={index}
                className="flex justify-between items-center my-2"
                >
                  <span className="font-semibold">{ticket.name}</span>
                  <span className="font-semibold">{ticket.price}</span>
                  <span className="text-red-600 text-sm mb-1 font-semibold">
                    x {ticket.quantity}
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
      <h2 className="text-2xl font-bold py-4">Ticket Information</h2>
      {
        ticket && ticket.map((t, idx)=>{
          return (
              <Paper elevation={2}  sx={{width: "full", padding: "2rem", margin: "1rem 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div className="flex">
                  <div className="bg-[#E90064] w-8 h-8 flex justify-center items-center rounded-lg text-white font-semibold text-lg mr-2">{idx+1}</div> 
                  <h2 className="text-xl font-semibold">
                    {parsedTicketType.find(type => type.seat_type_id === t.seat_type_id).name}
                  </h2>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col mr-4 ">
                    <label htmlFor="">Seat NO.</label> 
                    <FormControl sx={{ width: 240 }}>
                      <Select
                        value={ticket[idx].seat_no}
                        autoWidth={false}
                        // error={missing.includes("Gender")}
                        onChange={(e)=>{
                          setTicket(prevList => {
                              const updatedList = [...prevList]
                              updatedList[idx] = {
                                ...updatedList[idx],
                                "seat_no": e.target.value, // Update the desired property
                              };
                              return updatedList;
                            })
                          }
                        }
                        >
                          {
                            available_seat[t.seat_type_id].map((seat: string)=>{
                              return <MenuItem value={seat}>{seat}</MenuItem>
                            })
                          }
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex flex-col mr-4">
                    <label htmlFor="">Event Date</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        value={dayjs(ticket[idx].ticket_date)}
                        minDate={dayjs(event.event_startdate).subtract(1, 'day')}
                        maxDate={dayjs(event.event_enddate).subtract(1, 'day')}
                        // error={missing.includes("Date of Birth")}
                        onChange={(e)=>{
                          setTicket(prevList => {
                              const updatedList = [...prevList]
                              updatedList[idx] = {
                                ...updatedList[idx],
                                "ticket_date": dayjs(e.$d).format("YYYY-MM-DD"), // Update the desired property
                              };
                              return updatedList;
                            })
                        }}
                        sx={{width: "25ch"}} 
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                        checked={ticket[idx].refundable} 
                        onChange={(e)=>{
                          // console.log(e.target.checked)
                            setTicket(prevList => {
                                const updatedList = [...prevList]
                                updatedList[idx] = {
                                  ...updatedList[idx],
                                  "refundable": e.target.checked, // Update the desired property
                                };
                                return updatedList;
                              })
                          }
                        }
                        />
                      }
                      label="Refundable" 
                    />
                    <label htmlFor="" className="text-lg font-medium">{parsedTicketType.find(type => type.seat_type_id === t.seat_type_id).price*0.3} Bath</label>
                  </div>
                </div>
              </Paper>
          )
        })
      }
      
      <h2 className="text-2xl font-bold py-4">Voucher</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
            <p className="mt-2 ml-4">Voucher Code:</p>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 ml-4 rounded-md"
                placeholder="Add voucher"
              />
              <button
                type="button"
                onClick={handleVoucherRedeem}
                className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-small py-0.5 px-5 ml-4 rounded-full"
              >
                Add
              </button>
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
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Select Payment Method</h2>
        <h2 className="text-red-600 text-xl font-semibold py-4">
          Credit card / Debit Card
        </h2>
        <h1 className="ml-4 mt-2">Existing Card</h1>
        <PaymentSelect 
          userPayment={userPayment}
          required={true}
          value={selectedPayment}
          onChange={(e)=>{setSelectedPayment(e.target.value) }}
        />
      </div>
      <Button onClick={()=>{router.push("/users/payment/add")}} variant="contained" color="primary" style={{ backgroundColor: '#E90064', marginTop: "2rem" }}>Add New Payment</Button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Review Order Summary</h2>
        <div className="mt-2">
          <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Item</span>
              <span className="font-semibold">Price</span>
              <span className="font-semibold">Fee (Incl. VAT)</span>
              <span className="font-semibold">Quantity</span>
              <span className="font-semibold">Subtotal</span>
            </div>
            <hr className="my-2" />
            <ul className="mt-2">
              {selectedTickets.map((ticket, index) => {
                if (ticket.quantity !== 0) {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center my-2"
                    >
                      <span className="font-semibold">{ticket.name}</span>
                      <span className="font-semibold">{ticket.price}</span>
                      <span className="font-semibold">
                        {(ticket.price * 7) / 100}
                      </span>
                      <span className="font-semibold">{ticket.quantity}</span>
                      <span className="font-semibold">
                        {ticket.price * 1.07 * ticket.quantity}
                      </span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <hr className="my-2" />
            <div className="flex justify-end">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold ml-2">
                {billing.subTotal}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">Voucher</span>
              <span className="font-semibold ml-2">
                {billing.voucher}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">Refundable Tickets</span>
              <span className="font-semibold ml-2">
                {billing.refundDown}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-2xl font-semibold">Grand Total</span>
              <span className="text-red-600 text-xl font-semibold ml-2">
                {billing.grandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Button
        disabled={
          !ticket.every(ticket => ticket.ticket_date !== '' && ticket.seat_no !== '') ||
          selectedPayment == null 
        }
        onClick={handlePaymentSubmit}
        className="bg-[#E90064] hover:bg-[#c60056e6] text-white px-6 mt-6 mb-20 ml-[90%] "
      >
        Confirm
      </Button>
    </div>
  );
};
export default CheckoutPage;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user_id = session?.user?.user_id;
  // const router = useRouter(context)
  const {id} = context.query
  try {
    const response1 = await axios.get(`https://ticketapi.fly.dev/get_event?event_id=${id}`);
    const response2 = await axios.get(`https://ticketapi.fly.dev/get_available_seat?event_id=${id}`);
    const response3 = await axios.get( `https://ticketapi.fly.dev/get_user_payment?user_id=${user_id}`);

    const event = response1.data[0];
    const available_seat = response2.data.available_seat;
    const userPayment = response3.data
    return {
      props: {
        event: event,
        available_seat: available_seat,
        userPayment: userPayment
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        event: null,
        available_seat: null,
        userPayment: null
      },
    };
  }
};
