import { useState, useEffect } from "react";
import EventCard from "@/components/event_card";
import Link from "next/link";
import axios from "axios";

type Event = {
  event_id: string;
  event_name: string;
  event_startdate: string;
  location: string;
  poster: string;
};

export default function AllEventsPopular() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Event[]>("https://ticketapi.fly.dev/get_event")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => console.error(error));
  }, []);

  // console.log(events);

  return (
    <main>
      <div className="card-list md:grid sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-4 flex flex-col gap-6 ">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Link
              href={{ pathname: "/events/[id]", query: { id: event.event_id } }}
              key={event.event_id}
            >
              <EventCard
                eventDate={event.event_startdate}
                img={event.poster}
                eventName={event.event_name}
                location={event.location}
              />
            </Link>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </main>
  );
}
