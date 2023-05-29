import { useRouter } from "next/router";
import organize from "./organize_mock"; // Replace with your actual event data
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { useEffect, useState, Fragment } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, Transition } from "@headlessui/react";
import {
  Alert,
  Checkbox,
  Collapse,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
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

export default function Dashboard() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [organizeData, setOrganizeData] = useState({
    organize_id: id,
    user_id: "",
  });
  const [members, setMembers] = useState([]);
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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e) => {
    setOrganizeData({
      ...organizeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = () => {
    const { user_id } = organizeData;

    // Parse the user_id as an integer
    const parsedUserId = parseInt(user_id, 10);
    const parsedOrganizeId = parseInt(id, 10);

    // Make the API call with the parsed user_id
    axios
      .post("https://ticketapi.fly.dev/add_member", {
        user_id: parsedUserId,
        organize_id: parsedOrganizeId,
      })
      .then((response) => {
        // Handle the API response if needed
        console.log(response.data);

        // Reset the form or update the state as needed
        setOrganizeData({
          ...organizeData,
          user_id: "",
        });

        // Refresh the page
        window.location.reload();
      })
      .catch((error) => {
        // Handle any errors that occur during the API call
        console.error("Error adding member:", error);
      });
  };

  useEffect(() => {
    // Fetch event data from the API endpoint
    axios
      .get(`https://ticketapi.fly.dev/get_organize_event?organize_id=${id}`)
      .then((response) => setEvent(response.data))
      .catch((error) => console.error("Error fetching event data:", error));

    // Fetch members data from the API endpoint
    axios
      .get(`https://ticketapi.fly.dev/get_member?organize_id=${id}`)
      .then((response) => setMembers(response.data))
      .catch((error) => console.error("Error fetching members data:", error));
  }, [id]);

  if (!event || !members) {
    // Handle case when event data or members data is not yet loaded
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  let totalSale = 0;
  let totalRefund = 0;

  eventData2.forEach((event) => {
    if (parseInt(event.organize_id) == parseInt(id)) {
      if (event.event_id) {
        const sale = parseInt(event.total_sale);
        if (!isNaN(sale)) {
          totalSale += sale;
        }
      }
    }
  });

  eventData2.forEach((event) => {
    if (parseInt(event.organize_id) == parseInt(id)) {
      if (event.event_id) {
        const refud = parseInt(event.total_refund);
        if (!isNaN(refud)) {
          totalRefund += refud;
        }
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
  // Prepare data and labels for the bar chart
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

  const chartOptions1 = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Remove decimal points from y-axis values
        },
      },
    },
  };

  const totalSalesChartData = {
    labels: top5Events
      .filter((event) => parseInt(event.organize_id) === parseInt(id))
      .map((event) => event.event_name),
    datasets: [
      {
        label: "Total Sale",
        data: top5Events
          .filter((event) => parseInt(event.organize_id) === parseInt(id))
          .map((event) => event.total_sale),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  // Prepare data and labels for the bar chart of number of followers
  const followersChartData = {
    labels: top5Events1
      .filter((event) => parseInt(event.organize_id) === parseInt(id))
      .map((event) => event.event_name),
    datasets: [
      {
        label: "Number of Followers",
        data: top5Events1
          .filter((event) => parseInt(event.organize_id) === parseInt(id))
          .map((event) => parseInt(event.follower)),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Customize the bar color
      },
    ],
  };

  return (
    <div className="container mx-auto px-10">
      <h1 className="text-3xl font-bold py-6">All Event Dashboard</h1>

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
        <div>
          <Bar height={100} data={totalSalesChartData} options={chartOptions} />
        </div>
        <div>
          <h2 className=" text-lg py-2 px-2 font-semibold">
            Top 5 Events by Number of Followers
          </h2>
          <Bar height={100} data={followersChartData} options={chartOptions1} />
        </div>
      </div>

      <h1 className="text-2xl font-bold py-6">Event Dashboard</h1>
      <div className="grid grid-cols-3 gap-8 w-full h-full mx-10">
        {event.map((eventData) => (
          <Link
            href={`/organize/${id}/dashboard/${eventData.event_id}`}
            key={eventData.event_id}
            className="px-4 py-12 font-medium text-[#060047] border border-gray-200 rounded-lg shadow hover:bg-slate-50 bg-white"
          >
            <h5 className="mb-2 flex justify-center text-4xl font-bold tracking-tight text-[#060047]">
              {eventData.event_name}
            </h5>
            <div className="flex justify-center">Dashboard</div>
          </Link>
        ))}
        <Link
          href={`/organize/${id}/create_event`}
          className="px-4 py-12 font-medium text-[#060047] border border-gray-200 rounded-lg shadow hover:bg-slate-50 bg-white"
        >
          <h5 className="mb-2 flex justify-center text-4xl font-bold tracking-tight text-[#060047]">
            +
          </h5>
          <div className="flex justify-center">Create Event</div>
        </Link>
      </div>

      <div className="flex justify-between mt-1 pt-4">
        <h1 className=" text-2xl font-bold">Add Member</h1>
        <button
          className="px-2 py-2 rounded  bg-[#E90064] hover:bg-[#c60056e6] text-white font-medium text-base"
          onClick={openModal}
        >
          Add Member
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Add Member
                  </Dialog.Title>
                  <form>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                      >
                        User ID
                      </label>
                      <TextField
                        id="name"
                        name="user_id"
                        type="text"
                        value={organizeData.user_id}
                        required
                        sx={{ width: "40ch" }}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mt-6 ">
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                          !organizeData.user_id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#060047] hover:bg-[#E90064]"
                        }`}
                        onClick={handleAddMember}
                        disabled={!organizeData.user_id}
                      >
                        Add Member
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div>
        <ul className="divide-y divide-gray-200">
          {members.map((member) => (
            <li key={member.user_id} className="py-4">
              <p className="text-lg font-bold">
                {member.f_name} {member.l_name}
              </p>
              <p className="text-gray-500">{member.email}</p>
              <p className="text-gray-500">{member.tel}</p>
              <p className="text-gray-500">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
