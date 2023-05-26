import { useState, useEffect } from "react";
import EventCard from "@/components/event_card";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";

type Event = {
  event_id: string;
  event_name: string;
  event_startdate: string;
  location: string;
  poster: string;
  event_type_id: number;
  follower: number;
};

export default function AllEventsMusic() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Event[]>("https://ticketapi.fly.dev/get_event")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (event) =>
            event.event_type_id === 2 ||
            event.event_type_id === 3 ||
            event.event_type_id === 4
        );
        const sortedEvents = filteredEvents.sort(
          (a, b) => b.follower - a.follower
        );
        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  return (
    <main className="container mx-auto px-10">
      <h1 className="text-2xl font-bold py-4">Music & Festival</h1>
      <div className="card-list md:grid sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-4 flex flex-col gap-6">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Link
              href={{ pathname: "/events/[id]", query: { id: event.event_id } }}
              key={event.event_id}
            >
              <EventCard
                eventDate={formatDate(event.event_startdate)}
                img={event.poster}
                eventName={event.event_name}
                location={event.location}
              />
            </Link>
          ))
        ) : (
          <p>No music events found.</p>
        )}
      </div>
    </main>
  );
}
