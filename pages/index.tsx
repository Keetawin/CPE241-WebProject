import React from "react";
import AllEventsPage from "./events";
import AllEventsPopular from "./events/popular";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {

  const { data: session, status } = useSession();
  // const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session)
    if(session && session.callbackUrl && !session.user.user_id){
        router.push(session.callbackUrl);
    }
  }, [session]);
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
