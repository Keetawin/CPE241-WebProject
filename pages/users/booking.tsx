import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import ShowBooking from "@/components/show_booking";

type Booking = {
  booking_id: string;
  total_price: string;
  quantity: string;
  event_id: string;
  booking_date: string;
};

type Event = {
  event_id: string;
  event_name: string;
  event_startdate: string;
  event_enddate: string;
  location: string;
  poster: string;
};

export default function Booking() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking[]>([]);
  const session = useSession();

  useEffect(() => {
    console.log(session.data?.user?.user_id);
    axios
      .get<Booking[]>(
        `https://ticketapi.fly.dev/user_booking?user_id='${session.data?.user?.user_id}'`
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);

        // Extract the event IDs from the tickets
        const eventIds = response.data.map((booking) => booking.event_id);

        // Retrieve event details for each event ID
        eventIds.forEach((eventId) => {
          axios
            .get<Event[]>(
              `https://ticketapi.fly.dev/get_event?event_id=${eventId}`
            )
            .then((response) => {
              const sortedEvents = response.data.sort((a, b) =>
                dayjs(b.event_startdate).diff(a.event_startdate)
              );
              setEvents((prevEvents) => [...prevEvents, ...sortedEvents]);
              setLoading(false);
              console.log(response);
            })
            .catch((error) => console.error(error));
        });

        setBooking(response.data); // Set the tickets received from the API
      })
      .catch((error) => console.error(error));
  }, [session]);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD-MM-YYYY");
  };

  const [open, setOpen] = useState(false);

  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className="text-2xl font-bold py-6">My Booking</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div>
            <div>
              {booking.map((booking) => {
                const matchingEvent = events.find(
                  (event) => event.event_id === booking.event_id
                );
                if (!matchingEvent) {
                  return null; // Skip rendering if no matching event is found
                }
                return (
                  <div key={booking.booking_id}>
                    <div className="pl-10 w-full">
                      <ShowBooking
                        bookingid={booking.booking_id}
                        img={matchingEvent.poster}
                        eventName={matchingEvent.event_name}
                        price={booking.total_price}
                        quantity={booking.quantity}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
