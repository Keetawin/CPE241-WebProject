import { useState, useEffect } from "react";
import EventCard from "@/components/event_card";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";

type Event = {
  event_id: number;
  event_name: string;
  event_description: string;
  location: string;
  price: number;
  poster: string;
  event_startdate: string;
  event_enddate: string;
  event_type_id: number;
  follower: number;
};

export default function MusicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Event[]>("https://ticketapi.fly.dev/get_event")
      .then((response) => {
        const sortedEvents = response.data.sort(
          (a, b) => b.follower - a.follower
        );
        setEvents(sortedEvents);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  const displayedEvents = events
    .filter(
      (event) =>
        event.event_type_id === 2 ||
        event.event_type_id === 3 ||
        event.event_type_id === 4
    )
    .slice(0, 6); // Limit the number of displayed events to 6

  return (
    <main>
      <div className="px-10 card-list md:grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 flex flex-col gap-6 ">
        {displayedEvents && displayedEvents.length > 0 ? (
          displayedEvents.map((event) => (
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
