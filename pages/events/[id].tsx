import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import data from "../api/mock_event.json";
import Image from "next/image";
import { useState } from "react";
import React from "react";
import Link from "next/link";

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
  { name: "Regular", price: 100, quantity: 0 ,remaining: 5},
  { name: "VIP", price: 500, quantity: 0 ,remaining: 7},
  { name: "Gold", price: 1000, quantity: 0 ,remaining: 4},
  { name: "Premium", price: 2000, quantity: 0 ,remaining: 3},
];

const EventDetail = ({ event }: Props) => {
  const [selectedTickets, setSelectedTickets] = useState(ticketTypes);

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
  return (
    <div className=" container mx-auto">
      <div className=" flex flex-col md:flex-row my-10">
        <div className="w-1/2 flex justify-center">
          <img
            className="inset-0 object-cover md:w-1/2 md:h-[50vh]"
            src={event.poster}
            alt="event poster"
          />
        </div>
        <div>
          <div className="flex gap-10">
            <p className="text-2xl font-semibold">Event followers</p>
            <p className="text-2xl">Lorem</p>
          </div>
          <div className="mt-2 text-lg">{event.event_type_id}</div>
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
            <button className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-2 px-6 rounded-full">
              Follow
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-24">
        <h1 className=" text-3xl font-bold text-[#060047]">Description</h1>
        <p className="text-lg py-4 md:px-24">
          Lorem ipsum dolor sit amet consectetur. Viverra nec sit lorem velit
          quam amet. Fermentum orci tempus blandit rutrum lorem mattis purus
          massa. Sodales sapien enim dui in mattis enim fames. Vitae convallis
          eget in amet aliquam diam adipiscing. Eu est neque ut aliquet
          ultricies neque euismod quis dictumst. Felis tortor arcu neque massa
          nunc urna dignissim amet tempor. A quisque feugiat dolor laoreet
          mattis purus odio laoreet. Auctor id elit amet convallis mi at ut.
          Consequat curabitur augue scelerisque ut nunc morbi tincidunt. Congue
          pharetra tortor pretium enim leo enim id. Facilisis ullamcorper dolor
          blandit mauris est elit nascetur facilisis. Diam urna varius odio
          convallis adipiscing. Magna lobortis vitae purus integer maecenas
          dolor nec. Senectus sem laoreet velit ipsum in et neque tristique
          mauris. Bibendum ipsum lorem et convallis tortor lorem gravida
          fermentum risus. Blandit non sagittis aliquam.
        </p>
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
              
              <Link
              href={{ pathname: "/events/checkout/[id]", query: { id: event.event_id } }}
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
  const event = data.find(
    (item) => item.event_id === parseInt(params?.id as string)
  );
  if (!event) {
    return { notFound: true };
  }
  return { props: { event } };
};
