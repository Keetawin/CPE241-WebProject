import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import React from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import Link from "next/link";
import EventCard from "@/components/event_card";
import dayjs from "dayjs";
import { Button } from "@nextui-org/react";
export default function Follow_Event({ userFollowedEvent }) {
  const { data: session } = useSession();
  console.log(userFollowedEvent);
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  return (
    <main>
      {session && (
        <div className="container mx-auto px-10">
          <h1 className="text-2xl font-bold py-6">Follow Event</h1>
          <div className="flex h-full">
            <div className="flex flex-col">
              <ProfileCard />
              <div className="my-4">
                <MenuBar />
              </div>
            </div>
            <div className="pl-10 w-full">
              {userFollowedEvent.length > 0 ? (
                <div className="grid grid-cols-4 h-full gap-8">
                  {userFollowedEvent.map((event) => (
                    <Link
                      href={{
                        pathname: "/events/[id]",
                        query: { id: event.event_id },
                      }}
                      key={event.event_id}
                    >
                      <EventCard
                        eventDate={formatDate(event.event_startdate)}
                        img={event.poster}
                        eventName={event.event_name}
                        location={event.location}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="flex justify-center mt-12">
                  You have not followed any event.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {!session && (
        <div className="flex flex-col items-center justify-center h-[30rem]">
          <h1 className="font-semibold text-3xl">Please log in</h1>
          <h2 className="font-regular text-2xl">to use this page</h2>
          <Button
            className="my-4"
            variant="contained"
            color="primary"
            style={{ backgroundColor: "#E90064", cursor: "pointer" }}
            onClick={() => signIn("google")}
          >
            <p className="text-white">Log in with Google</p>
          </Button>
        </div>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user_id = session?.user?.user_id;

  try {
    const response = await axios.get(
      `https://ticketapi.fly.dev/get_user_followed_event?user_id=${user_id}`
    );
    const userFollowedEvent = response.data;

    return {
      props: {
        userFollowedEvent,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        userFollowedEvent: null, // or handle error case as desired
      },
    };
  }
};
