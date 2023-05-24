import React from "react";
import EventCard from "@/components/event_card";
import data from "../api/mock_event.json";
import Link from "next/link";

export default function AllEventsPage() {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const sortedData = data.sort(
    (a, b) => new Date(b.event_date) - new Date(a.event_date)
  );

  return (
    <main>
      <div className="card-list">
        <div className="md:grid sm:grid-cols-2 lg:grid-cols-6 md:grid-cols-4 flex flex-col gap-6">
          {sortedData.map((event) => (
            <Link
              href={{ pathname: "/events/[id]", query: { id: event.event_id } }}
              key={event.event_id}
            >
              <EventCard
                eventDate={formatDate(event.event_date)}
                img={event.poster}
                eventName={event.event_name}
                location={event.location}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
