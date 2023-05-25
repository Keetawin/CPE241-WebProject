import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import data from "../api/mock_event.json";
import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type Event = {
  event_id: number;
  event_name: string;
  event_description: string;
  location: string;
  price: number;
  poster: string;
  event_date: string;
  event_type_id: number;
  categories: string[];
};

type Props = {
  event: Event;
};

const ticketTypes = [
  { name: "Regular", price: 100, quantity: 0, remaining: 5 },
  { name: "VIP", price: 500, quantity: 0, remaining: 7 },
  { name: "Gold", price: 1000, quantity: 0, remaining: 4 },
  { name: "Premium", price: 2000, quantity: 0, remaining: 3 },
];

const EventDetail = ({ event }: Props) => {
  const [selectedTickets, setSelectedTickets] = useState(ticketTypes);
  const [followed, setFollowed] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string | null>(null);
  const { data: session } = useSession();

  // console.log(event)
  useEffect(() => {
    if (event) {
      handleEventType(event.event_type_id)
        .then((eventType) => {
          setEventType(eventType);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  useEffect(() => {
    if (event && session?.user?.user_id) {
      axios
        .get(
          `https://ticketapi.fly.dev/check_follow_event?user_id=${session?.user?.user_id}&event_id=${event.event_id}`
        )
        .then((res) => {
          setFollowed(res.data);
        });
    }
  }, [session]);

  const handleFollow = () => {
    axios
      .post("https://ticketapi.fly.dev/follow_event", {
        user_id: session.user?.user_id,
        event_id: event.event_id,
      })
      .then((res) => {
        setFollowed(true);
      });
  };

  const handleUnfollow = () => {
    axios
      .delete(
        `https://ticketapi.fly.dev/follow_event?event_id=${event.event_id}&user_id=${session?.user?.user_id}`
      )
      .then((res) => {
        setFollowed(false);
      });
  };

  const handleEventType = (eventTypeId: number): Promise<string> => {
    return axios
      .get(
        `https://ticketapi.fly.dev/event_type_name?event_type_id=${eventTypeId}`
      )
      .then((res) => {
        return res.data.event_type;
      });
  };

  const handleIncrement = (ticketTypeIndex: number) => {
    const updatedTickets = [...selectedTickets];
    const currentQuantity = updatedTickets[ticketTypeIndex].quantity;
    if (currentQuantity < updatedTickets[ticketTypeIndex].remaining) {
      updatedTickets[ticketTypeIndex].quantity++;
      setSelectedTickets(updatedTickets);
    }
  };

  const handleDecrement = (ticketTypeIndex: number) => {
    const updatedTickets = [...selectedTickets];
    const currentQuantity = updatedTickets[ticketTypeIndex].quantity;
    if (currentQuantity > 0) {
      updatedTickets[ticketTypeIndex].quantity = currentQuantity - 1;
      setSelectedTickets(updatedTickets);
    }
  };

  const totalTickets = selectedTickets.reduce((acc, ticketType) => {
    return acc + ticketType.quantity;
  }, 0);

  const totalPrice = selectedTickets.reduce((acc, ticketType) => {
    return acc + ticketType.price * ticketType.quantity;
  }, 0);

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { query } = router;
  const eventId = query.id;
  // console.log(query)
  return (
    <div className=" container mx-auto">
      <div className=" flex flex-col md:flex-row my-10">
        <div className="w-1/2 flex justify-center">
          {event.poster && (
            <img
              className="inset-0 object-cover md:w-1/2 md:h-[50vh]"
              src={event.poster}
              alt="event poster"
            />
          )}
        </div>
        <div>
          <div className="flex gap-10">
            <p className="text-2xl font-semibold">Event followers</p>
            <p className="text-2xl">Lorem</p>
          </div>
          <div className="mt-2 text-lg">{eventType}</div>
          <h1 className="text-3xl font-bold py-2">{event.event_name}</h1>
          <div className="flex flex-col ml-4 gap-3">
            <p className=" text-lg font-medium">
              {event.event_date} - {event.event_date}
            </p>
            <p className=" text-lg font-semibold">Categories</p>
            <div className="pl-4 text-lg">{event.categories}</div>
            <p className=" text-lg font-semibold">Location</p>
            <div className="pl-4 text-lg">{event.location}</div>
          </div>
          <div className="flex mt-6 justify-end">
            {followed && session?.user?.user_id && (
              <button
                className="bg-[#8e8e8e] hover:bg-[#d1d1d1e6] text-[#ededed] font-bold py-2 px-6 rounded-full"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            )}
            {!followed && session?.user?.user_id && (
              <button
                className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-2 px-6 rounded-full"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-24">
        <h1 className=" text-3xl font-bold text-[#060047]">Description</h1>
        <p className="text-lg py-4 md:px-24">{event.event_description}</p>
        <h1 className=" text-3xl font-bold text-[#060047]">Tickets</h1>
        <div className="flex gap-8 px-2 py-4">
          <div className=" basis-2/3 flex flex-col gap-4">
            {selectedTickets.map((ticketType, index) => (
              <div
                className=" w-full border-[1.5px] border-slate-300 rounded"
                key={index}
              >
                <div className="flex justify-between pt-4 px-4">
                  <h2 className=" font-semibold text-xl">{ticketType.name}</h2>
                  <div className="flex gap-4 items-center">
                    <p className=" font-semibold text-xl">
                      ฿{ticketType.price}
                    </p>
                    <button
                      className="w-8 h-8 bg-[#060047] text-white font-semibold text-xl"
                      onClick={() => handleDecrement(index)}
                    >
                      -
                    </button>
                    <p className=" font-semibold text-xl">
                      {ticketType.quantity}
                    </p>
                    <button
                      className="w-8 h-8 bg-[#060047] text-white font-semibold text-xl"
                      onClick={() => handleIncrement(index)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="px-4 py-4 font-medium text-red-500">
                  Available until {event.event_date}
                </div>
                <div className="px-4 pb-4 font-medium  text-[#060047]">
                  {ticketType.remaining} remaining
                </div>
              </div>
            ))}
          </div>
          <div className=" basis-1/3">
            <div className=" w-full border-[1.5px] px-4 py-4 border-slate-300 rounded min-h-[12rem]">
              <p className=" text-base font-semibold">
                Total ({totalTickets} items)
              </p>
              <p className="mt-4 font-bold text-2xl text-[#060047]">
                ฿{totalPrice}
              </p>
              <p className="mt-4 text-slate-400">
                * All Prices exclude VAT
                <br />* Some fees may be applied
              </p>
              <button
                className={`mt-4 w-full text-white font-semibold text-xl py-2 rounded ${
                  totalTickets === 0 ? "bg-gray-400" : "bg-[#060047]"
                }`}
                disabled={totalTickets === 0}
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = data.map((event) => ({
    params: { id: event.event_id.toString() },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const eventId = params?.id; // Assuming you have a dynamic route parameter named "id"
    const response = await axios.get(
      `https://ticketapi.fly.dev/get_event?event_id=${eventId}`
    );
    const eventData = response.data[0];
    // console.log(response.data)

    if (!eventData) {
      return { notFound: true };
    }
    return {
      props: {
        event: eventData,
      },
    };
  } catch (error) {
    console.error("Error fetching event data:", error);

    return { notFound: true };
  }
};
