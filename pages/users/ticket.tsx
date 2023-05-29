import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import Test from "@/components/show_ticket";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";
import ShowTicket from "@/components/show_ticket";

type Ticket = {
  ticket_id: string;
  event_id: string;
  seat_type: string;
  seat_no: string;
  ticket_date: string;
  refundable: string;
  isrefund: string;
};

type Event = {
  event_name: string;
  event_startdate: string;
  event_enddate: string;
  location: string;
  poster: string;
};

export default function Tickets() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const session = useSession();

  useEffect(() => {
    console.log(session.data?.user?.user_id);
    axios
      .get<Ticket[]>(
        `https://ticketapi.fly.dev/user_ticket?user_id='${session.data?.user?.user_id}'`
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
              // console.log(response);
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

  const tabs = [
    { id: 1, label: "Active Tickets" },
    { id: 2, label: "Past Tickets" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [open, setOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

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
          <div className="w-full">
            <div className="flex space-x-4 py-">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${
                    activeTab === tab.id
                      ? "bg-[#060047] text-white font-medium"
                      : "bg-gray-300"
                  } px-4 py-2 font-medium rounded-md`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 1 && (
              <main className="mb-10">
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
                              <ShowTicket
                                ticketid={ticket.ticket_id}
                                eventid={ticket.event_id}
                                img={event.poster}
                                seatType={ticket.seat_type}
                                seatNo={ticket.seat_no}
                                eventType={event.event_type}
                                eventName={event.event_name}
                                location={event.location}
                                eventStart={event.event_startdate}
                                eventEnd={event.event_enddate}
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
                  <p style={{ marginTop: "40px", marginLeft: "30px" }}>
                    No Active Tickets found.
                  </p>
                )}
              </main>
            )}

            {activeTab === 2 && (
              <main className="mb-10">
                {tickets.filter(
                  (ticket) => new Date(ticket.ticket_date) < new Date()
                ).length > 0 ? (
                  tickets.map((ticket) => {
                    if (new Date(ticket.ticket_date) < new Date()) {
                      const event = events.find(
                        (event) => event.event_id === ticket.event_id
                        );
                        if (event) {
                        console.log(ticket, event)
                        return (
                          <div className="pl-10 w-full" key={event.event_id}>
                            {!ticket.isrefund && (
                              <ShowTicket
                                ticketid={ticket.ticket_id}
                                eventid={ticket.event_id}
                                img={event.poster}
                                seatType={ticket.seat_type}
                                seatNo={ticket.seat_no}
                                eventType={event.event_type}
                                eventName={event.event_name}
                                location={event.location}
                                eventStart={event.event_startdate}
                                eventEnd={event.event_enddate}
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
                  <p style={{ marginTop: "40px", marginLeft: "30px" }}>
                    No Active Tickets found.
                  </p>
                )}
              </main>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
