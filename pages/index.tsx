import React from "react";
import AllEventsPage from "./events";
import AllEventsPopular from "./events/popular";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "@/components/footer";
import MusicEvents from "./events/component/music";
import EducationEvents from "./events/component/education";
import SportEvents from "./events/component/sport";
import { GetServerSideProps } from "next";
import axios from "axios";
import EventsUpcoming from "./events/component/upcoming";

export default function Home({ categories, event_type }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log(session);
    if (session && session.callbackUrl && !session.user.user_id) {
      router.push(session.callbackUrl);
    }
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto ">
          <h1 className="text-2xl font-bold py-4">Popular Events</h1>
          <AllEventsPopular />

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold py-4">Upcoming Events</h1>
            <Link
              href="/events/upcoming"
              className="text-md font-medium py-4 text-[#3f36a5]"
            >
              View All
            </Link>
          </div>
          <EventsUpcoming />

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold py-4">Music & Festival</h1>
            <Link
              href="/events/music-festival"
              className="text-md font-medium py-4 text-[#3f36a5]"
            >
              View All
            </Link>
          </div>
          <MusicEvents />

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold py-4">Education</h1>
            <Link
              href="/events/education"
              className="text-md font-medium py-4 text-[#3f36a5]"
            >
              View All
            </Link>
          </div>
          <EducationEvents />

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold py-4">Sport</h1>
            <Link
              href="/events/education"
              className="text-md font-medium py-4 text-[#3f36a5]"
            >
              View All
            </Link>
          </div>
          <SportEvents />
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response1 = await axios.get("https://ticketapi.fly.dev/categories");
    const response2 = await axios.get("https://ticketapi.fly.dev/event_types");
    const categories = response1.data;
    const event_type = response2.data;
    return {
      props: {
        categories: categories,
        event_type: event_type,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        categories: null,
        event_type: null,
      },
    };
  }
};
