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
  event_name: string;
  event_startdate: string;
  event_enddate: string;
  location: string;
  poster: string;
};

export default function Booking() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const session = useSession();

  useEffect(() => {
    console.log(session.data?.user?.user_id);
    axios
      .get<Ticket[]>(
        `https://ticketapi.fly.dev/user_booking?user_id='${session.data?.user?.user_id}'`
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);

        // Extract the event IDs from the tickets
        const eventIds = response.data.map((ticket) => ticket.event_id);

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

        setTickets(response.data); // Set the tickets received from the API
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
        <h1 className="text-2xl font-bold py-6">My Tickets</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div>
            <main>
              {tickets.filter(
                (ticket) => new Date(ticket.ticket_date) >= new Date()
              ).length > 0 ? (
                tickets.map((ticket) => {
                  if (new Date(ticket.ticket_date) >= new Date()) {
                    const event = events.find(
                      (event) => event.event_id === ticket.event_id
                    );
                    if (event) {
                      return (
                        <div className="pl-10 w-full" key={event.event_id}>
                          {!ticket.isrefund && (
                            <ShowBooking
                              ticketid={ticket.ticket_id}
                              eventid={ticket.event_id}
                              img={event.poster}
                              eventName={event.event_name}
                              location={event.location}
                              eventStart={formatDate(event.event_startdate)}
                              eventEnd={formatDate(event.event_enddate)}
                              refund={ticket.refundable}
                              isrefund={ticket.isrefund}
                            />
                          )}
                        </div>
                      );
                    }
                  }
                  return null;
                })
              ) : (
                <p></p>
              )}
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}