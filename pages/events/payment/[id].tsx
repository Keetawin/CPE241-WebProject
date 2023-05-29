import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DataGrid, GridFooterContainer } from "@mui/x-data-grid";
import dayjs from "dayjs";

const BookingPaymentPage = () => {
  const router = useRouter();
  const { bookingId, id } = router.query;
  const [bookingData, setBookingData] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.user_id) {
      fetchBookingData(session.user.user_id);
    }
  }, [session]);

  const fetchBookingData = async (userId) => {
    try {
      const response = await axios.get(
        `https://ticketapi.fly.dev/user_booking?user_id=${userId}`
      );
      const filteredBookings = response.data.filter(
        (booking) => booking.booking_id === Number(id)
      );
      setBookingData(filteredBookings);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  if (bookingData.length === 0) {
    return <div>Loading...</div>;
  }

  // Format the date in "DD/MM/YY" format
  const formatDate = (dateString) => {
    const formattedDate = dayjs(dateString).format("DD/MM/YY");
    return formattedDate;
  };

  const CustomFooter = ({ rows }) => {
    const subtotal = rows.reduce(
      (total, row) => total + parseFloat(row.price || 0),
      0
    );
    return (
      <GridFooterContainer>
        {`Subtotal: $${subtotal.toFixed(2)}`}
      </GridFooterContainer>
    );
  };

  const handleConfirmPayment = async () => {
    try {
      const paymentData = {
        payment_info_id: bookingData[0].payment_info_id, // Assuming the payment_info_id is available in the first booking
        amount: totalPrice,
        booking_id: id,
      };
      await axios.post(
        "https://ticketapi.fly.dev/confirm_payment",
        paymentData
      );
      // Handle success
      console.log("Payment confirmed successfully");
      router.push("/users/ticket"); // Redirect to "/users/ticket" after successful payment
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const columns = [
    { field: "ticket_id", headerName: "Ticket ID", width: 150 },
    { field: "seat_no", headerName: "Seat No", width: 150 },
    { field: "seat_type", headerName: "Seat Type", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "refundable", headerName: "Refundable", width: 150 },
    {
      field: "ticket_date",
      headerName: "Ticket Date",
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
  ];

  // Map the booking data to rows for the DataGrid
  const rows = bookingData.flatMap((booking) =>
    booking.ticket.map((ticket) => ({
      id: ticket.ticket_id,
      ticket_id: ticket.ticket_id,
      seat_no: ticket.seat_no,
      seat_type: ticket.seat_type,
      price: ticket.price,
      refundable: ticket.refundable ? "Yes" : "No",
      ticket_date: ticket.ticket_date,
    }))
  );

  // Calculate the total price
  const totalPrice = rows.reduce(
    (total, row) => total + parseFloat(row.price || 0),
    0
  );

  // Render the booking information using the DataGrid
  return (
    <main className="container mx-auto px-10">
      <h1 className="text-2xl font-bold py-4">Confirm Payment</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
      <div className="py-4 font-medium flex justify-end">
        Total Price: {totalPrice.toFixed(2)} ฿
      </div>
      <div className="flex justify-end">
        <button
          className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-2 px-6 rounded-full"
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>
      </div>
    </main>
  );
};

export default BookingPaymentPage;
