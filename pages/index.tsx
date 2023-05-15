import React from "react";
import AllEventsPage from "./events";
import AllEventsPopular from "./events/popular";
import Link from "next/link";
export default function Home() {
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-4">Popular Events</h1>

        <AllEventsPopular />
        <div className="flex justify-between items-center">
          <h1 className=" text-2xl font-bold py-4">Upcoming Events</h1>
          <Link
            href="/events/upcoming"
            className=" text-md font-medium py-4 text-[#3f36a5]"
          >
            View All
          </Link>
        </div>
        <AllEventsPage />
      </div>
    </main>
  );
}
