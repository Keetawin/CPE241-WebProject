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
  popularity: number; // Add popularity property to the Event type
};

export default function EventsUpcoming() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Event[]>("https://ticketapi.fly.dev/get_event")
      .then((response) => {
        const sortedEvents = response.data.sort(
          (a, b) => b.popularity - a.popularity // Sort events based on popularity
        );
        const popularEvents = sortedEvents.slice(0, 4); // Get the first 4 events (most popular)
        setEvents(popularEvents);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  return (
    <main className="container mx-auto px-10">
      <div className="card-list md:grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 flex flex-col gap-6 ">
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
          <p>No events found.</p>
        )}
      </div>
    </main>
  );
}
