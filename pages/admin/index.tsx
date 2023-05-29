import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement
);

const Admin = () => {
  const { data: session, status } = useSession();
  const [eventData1, setEventData1] = useState<EventData[]>([]);
  const [eventData2, setEventData2] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get<EventData[]>(
          "https://ticketapi.fly.dev/get_event"
        );
        setEventData1(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData1();
  }, []);

  let totalSale = 0;
  let totalRefund = 0;

  eventData2.forEach((event) => {
    if (event.event_id) {
      const sale = parseInt(event.total_sale);
      if (!isNaN(sale)) {
        totalSale += sale;
      }
    }
  });

  eventData2.forEach((event) => {
    if (event.event_id) {
      const refud = parseInt(event.total_refund);
      if (!isNaN(refud)) {
        totalRefund += refud;
      }
    }
  });

  // Sort the eventData2 array in descending order based on total_sale
  const sortedEvents = eventData2.sort((a, b) => b.total_sale - a.total_sale);
  const sortedEvents1 = eventData1.sort(
    (a, b) => parseInt(b.follower) - parseInt(a.follower)
  );
  // Take the top 5 events from the sorted array
  const top5Events = sortedEvents.slice(0, 5);
  const top5Events1 = sortedEvents1.slice(0, 5);
  // Extract event names and total sales from the top 5 events
  const eventNames = top5Events.map((event) => event.event_name);
  const totalSales = top5Events.map((event) => event.total_sale);
  const followers = top5Events1.map((event) => parseInt(event.follower));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EventData[]>(
          "https://ticketapi.fly.dev/get_event_sale"
        );
        setEventData2(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: eventNames,
    datasets: [
      {
        label: "Total Sale",
        data: totalSales,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Remove decimal points from y-axis values
        },
      },
    },
  };

  const chartData1 = {
    labels: eventNames,
    datasets: [
      {
        label: "Number of Followers",
        data: followers,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  const totalSalesChartData = {
    labels: top5Events.map((event) => event.event_name),
    datasets: [
      {
        label: "Total Sale",
        data: top5Events.map((event) => event.total_sale),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  // Prepare data and labels for the bar chart of number of followers
  const followersChartData = {
    labels: top5Events1.map((event) => event.event_name),
    datasets: [
      {
        label: "Number of Followers",
        data: top5Events1.map((event) => parseInt(event.follower)),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  return (
    <div className="container mx-auto px-10 mb-6">
      <h1 className=" text-2xl font-bold py-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-8 w-full h-full mx-10 ">
        <div className="flex gap-6">
          <div className="text-4xl text-green-500">
            <FaMoneyBill />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Earning</p>
            <p className=" text-xl font-semibold">{totalSale} ฿</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-4xl text-red-500">
            <FaMoneyBillWave />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Refund</p>
            <p className=" text-xl font-semibold">{totalRefund} ฿</p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-4xl text-blue-500">
            <FaMoneyCheckAlt />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className=" text-xl font-semibold">
              {totalSale - totalRefund} ฿
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h2 className=" text-lg py-2 px-2 font-semibold">Top 5 Sale Popular</h2>
        <div className="cursor-none">
          <Bar height={100} data={totalSalesChartData} options={chartOptions} />
        </div>
        <div>
          <h2 className=" text-lg py-2 px-2 font-semibold">
            Top 5 Events by Number of Followers
          </h2>
          <Bar height={100} data={followersChartData} options={chartOptions} />
        </div>
      </div>

      <h1 className="text-2xl font-bold py-6">Event Dashboard</h1>
      <div className="grid grid-cols-3 gap-8 w-full h-full mx-10">
        {eventData1.map((eventData) => (
          <Link
            href={`/organize/${eventData.organize_id}/dashboard/${eventData.event_id}`}
            key={eventData.event_id}
            className="px-4 py-12 font-medium text-[#060047] border border-gray-200 rounded-lg shadow hover:bg-slate-50 bg-white"
          >
            <h5 className="mb-2 flex justify-center text-4xl font-bold tracking-tight text-[#060047]">
              {eventData.event_name}
            </h5>
            <div className="flex justify-center">Dashboard</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Admin;
