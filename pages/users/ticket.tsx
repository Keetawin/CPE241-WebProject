import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import Test from "@/components/test";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { getSession, useSession } from "next-auth/react";

type Ticket = {
  event_id: string;
  seat_type: string;
  seat_no: string;
  ticket_date: string;
  refundable: string;
};

type Event = {
  event_id: string;
  event_name: string;
  event_startdate: string;
  location: string;
  poster: string;
};

export default function Tickets() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const session = useSession();

  useEffect(() => {
      console.log(session.data?.user?.user_id)
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
              .get<Event[]>(`https://ticketapi.fly.dev/get_event?event_id=${eventId}`)
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
    return dayjs(dateString).format("YYYY-MM-DD");
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
          <div>
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
              <main>
              {tickets.map((ticket) => {
                if (new Date(ticket.ticket_date) >= new Date()) {
                  const event = events.find((event) => event.event_id === ticket.event_id);
                  if (event) {
                    return (
                      <div className="pl-10 w-full" key={event.event_id}>
                        <Test
                          img={event.poster}
                          eventName={event.event_name}
                          location={event.location}
                          eventDate={event.event_startdate}
                        />
                      </div>
                    );
                  }
                }
                <p>No Ticket found.</p>
              })}
            </main>
            )}
  
            {activeTab === 2 && (
              <main>
              {tickets.map((ticket) => {
                if (new Date(ticket.ticket_date) < new Date()) {
                  const event = events.find((event) => event.event_id === ticket.event_id);
                  if (event) {
                    return (
                      <div className="pl-10 w-full" key={event.event_id}>
                        <Test
                          img={event.poster}
                          eventName={event.event_name}
                          location={event.location}
                          eventDate={event.event_startdate}
                        />
                      </div>
                    );
                  }
                }
                <p>No Ticket found.</p>
              })}
            </main>
            )}
          </div>
        </div>
      </div>
    </main>
  );
  
}
