import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import data from "../api/mock_event.json";
import Image from "next/image";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import Link from "next/link";

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
  categories: string[];
};

type Props = {
  event: Event;
};

const EventDetail = ({ event }: Props) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [followed, setFollowed] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string | null>(null);
  const [NumberOfFollower, setNumberOfFollower] = useState<number>(0);
  const { data: session } = useSession();

  const formattedStartDate = event?.event_startdate
    ? dayjs(event.event_startdate).format("D MMMM YYYY")
    : "";
  const formattedEndDate = event?.event_enddate
    ? dayjs(event.event_enddate).format("D MMMM YYYY")
    : "";

  // Rest of the code...

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_event_seat_type?event_id=${event.event_id}`
        );
        const ticketTypeData = response.data;

        const updatedTicketTypes = ticketTypeData.map((ticketType) => ({
          name: ticketType.seat_type,
          price: parseFloat(ticketType.price),
          quantity: 0,
          remaining: ticketType.quantity_limit,
          sale_enddate: dayjs(ticketType.sale_enddate).format("D MMMM YYYY"), // Format the date
        }));

        setSelectedTickets(updatedTicketTypes);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    if (event && event.event_id) {
      fetchTicketTypes();
    }
  }, [event.event_id]);

  // Rest of the code...

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

  useEffect(() => {
    if (event && event.event_id) {
      axios
        .get(
          `https://ticketapi.fly.dev/get_event_follower?event_id=${event.event_id}`
        )
        .then((res) => {
          const eventData = res.data[0];
          if (eventData && eventData.number_of_follower) {
            setNumberOfFollower(parseInt(eventData.number_of_follower));
          }
        })
        .catch((error) => {
          console.error("Error fetching event followers:", error);
        });
    }
  }, [event]);

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
          <div className="mb-2 text-lg text-[#E90064]">{eventType}</div>
          <h1 className="text-3xl font-bold py-2">{event.event_name}</h1>

          <div className="flex flex-col ml-4 gap-3">
            <p className=" text-lg font-medium">
              {formattedStartDate} - {formattedEndDate}
            </p>
            <p className=" text-lg font-semibold">Categories</p>
            <div className="text-lg">{event.categories.join(", ")}</div>
            <p className=" text-lg font-semibold">Location</p>

            <div className="text-lg">{event.location}</div>
            <div className="flex gap-10">
              <p className="text-lg font-semibold">Event followers</p>
              <p className="text-lg font-semibold">{event.follower}</p>
            </div>
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
                  Available until {ticketType.sale_enddate}
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
              <Link
                href={{
                  pathname: `/events/checkout/[id]`,
                  query: {
                    id: event.event_id,
                    eventName: event.event_name,
                    ticketType: JSON.stringify(selectedTickets),
                    totalPrice: totalPrice,
                  },
                }}
                key={event.event_id}
              >
                <button
                  className={`mt-4 w-full text-white font-semibold text-xl py-2 rounded ${
                    totalTickets === 0 ? "bg-gray-400" : "bg-[#060047]"
                  }`}
                  disabled={totalTickets === 0}
                >
                  Buy Tickets
                </button>
              </Link>
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
    const eventId = params?.id;
    const [eventResponse, followersResponse] = await Promise.all([
      axios.get(`https://ticketapi.fly.dev/get_event?event_id=${eventId}`),
      axios.get(
        `https://ticketapi.fly.dev/get_event_follower?event_id=${eventId}`
      ),
    ]);
    const eventData = eventResponse.data[0];
    const followersData = followersResponse.data[0];

    if (!eventData) {
      return { notFound: true };
    }

    const numberOfFollowers = followersData
      ? parseInt(followersData.number_of_follower)
      : 0;

    return {
      props: {
        event: eventData,
        numberOfFollowers,
      },
      revalidate: 5, // Revalidate the data every 10 seconds
    };
  } catch (error) {
    console.error("Error fetching event data:", error);

    return { notFound: true };
  }
};
