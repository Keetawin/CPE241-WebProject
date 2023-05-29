import React from "react";
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getSession } from "next-auth/react";
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
import { useState, useEffect, Fragment, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

// Register the necessary elements and scales
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement
);

interface EventData {
  event_id: number;
  organize_id: number;
  event_name: string;
  event_startdate: string;
  event_enddate: string;
  location: string;
  email: string | null;
  tel: string | null;
  website: string | null;
  approved: boolean;
  payment_info_id: number;
  event_description: string;
  poster: string;
  event_type_id: number;
  total_refund: string;
  total_sale: string;
}

export default function EventDashBoard() {
  const router = useRouter();
  const { id, eventId } = router.query;
  const [eventData, setEventData] = useState(null);
  const [eventTypeName, setEventTypeName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [seatTypes, setSeatTypes] = useState([]);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [eventData2, setEventData2] = useState<EventData[]>([]);
  const [getTable, setGetTable] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
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

  const [formData, setFormData] = useState({
    event_id: eventId,
    seat_type: "",
    price: "",
    quantity_limit: "",
    sale_startdate: "",
    sale_enddate: "",
    seat_type_description: "",
  });
  const [secondFormData, setSecondFormData] = useState({
    seat_type_id: null,
    seat_row: "",
    seat_start: "",
    seat_end: "",
  });

  const transformDataForChart = () => {
    return ageDistribution.map((data) => ({
      ageRange: `Age ${data.age}`,
      frequency: data.frequency,
    }));
  };

  const transformedData = transformDataForChart();

  const labels = transformedData.map((data) => data.ageRange);
  const frequencies = transformedData.map((data) => data.frequency);

  const backgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
  ];

  const borderColor = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: frequencies,
        backgroundColor: backgroundColors,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = labels[context.dataIndex];
            const value = context.parsed;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  const chartData2 = {
    labels: genderDistribution.map((data) => data.gender),
    datasets: [
      {
        data: genderDistribution.map((data) => data.gender_count),
        backgroundColor: backgroundColors,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = genderDistribution[context.dataIndex];
            const value = context.parsed;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  const countByDate = {};
  getTable.forEach((entry) => {
    const date = dayjs(entry.payment_date).format("DD/MM/YYYY");
    countByDate[date] = countByDate[date] ? countByDate[date] + 1 : 1;
  });

  const chartData3 = {
    labels: Object.keys(countByDate),
    datasets: [
      {
        label: "Count",
        data: Object.values(countByDate),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions3 = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_available_seat?event_id=${eventId}`
        );
        setAvailableSeats(response.data.available_seat);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (eventId) {
      fetchAvailableSeats();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_event_seat_type?event_id=${eventId}`
        );
        setSeatTypes(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (eventId) {
      fetchSeatTypes();
    }
  }, [eventId]);

  const createSeatType = async (formData) => {
    try {
      const response = await axios.post(
        "https://ticketapi.fly.dev/create_seat_type?",
        { event_id: formData.event_id, ...formData }
      );
      // Handle the response or perform any necessary actions
      console.log(response.data);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      // Handle the error or display an error message
    }
  };

  const createSeatNumber = async (formData) => {
    try {
      const response = await axios.post(
        "https://ticketapi.fly.dev/create_seat_type_no",
        formData
      );
      // Handle the response or perform any necessary actions
      console.log(response.data);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      // Handle the error or display an error message
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "quantity_limit" ? parseInt(value) : value,
    }));
  };

  const handleChangeSecond = (e) => {
    const { name, value } = e.target;
    setSecondFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the createSeatType function and pass formData
    createSeatType(formData);
  };

  const handleSubmitSecond = (e) => {
    e.preventDefault();
    // Call the createSeatNumber function and pass secondFormData
    createSeatNumber(secondFormData);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  // ...

  const openSecondModal = (seatType) => {
    setIsSecondModalOpen(true);
    setSecondFormData((prevData) => ({
      ...prevData,
      seat_type_id: seatType.seat_type_id,
    }));
  };

  // ...

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
    setFormData({
      seat_type_id: null,
      seat_row: "",
      seat_start: "",
      seat_end: "",
    });
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await axios.get(
          `https://ticketapi.fly.dev/get_event?event_id=${eventId}`
        );
        const eventTypeResponse = await axios.get(
          `https://ticketapi.fly.dev/event_type_name?event_type_id=${eventResponse.data[0].event_type_id}`
        );
        setEventData(eventResponse.data);
        setEventTypeName(eventTypeResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
        // Handle error or display an error message
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchGenderDistribution = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/event_gender_distribute?event_id=${eventId}`
        );
        setGenderDistribution(response.data);
      } catch (error) {
        console.error("Error while fetching gender distribution data:", error);
      }
    };

    // Fetch gender distribution data when eventId is available
    if (eventId) {
      fetchGenderDistribution();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/event_transaction?event_id=${eventId}`
        );
        setGetTable(response.data);
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    };

    // Fetch gender distribution data when eventId is available
    if (eventId) {
      fetchTransaction();
    }
  }, [eventId]);

  useEffect(() => {
    const mapAgeToRange = (age) => {
      if (age < 18) {
        return "Teenager";
      } else if (age >= 18 && age < 30) {
        return "Young Adult";
      } else if (age >= 30 && age < 60) {
        return "Adult";
      } else {
        return "Senior";
      }
    };

    const fetchAgeDistribution = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/event_age_distribute?event_id=${eventId}`
        );
        const ageDistributionData = response.data.map((data) => ({
          ageRange: mapAgeToRange(data.age),
          frequency: data.frequency,
        }));
        setAgeDistribution(ageDistributionData);
      } catch (error) {
        console.error("Error while fetching age distribution data:", error);
      }
    };

    // Fetch age distribution data when eventId is available
    if (eventId) {
      fetchAgeDistribution();
    }
  }, [eventId]);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };

  const formatEventDate = (date) => {
    return dayjs(date).format("DD MMMM YYYY"); // Format the date using dayjs
  };

  const formatPaymentDates = (paymentDates) => {
    return paymentDates.map((date) => dayjs(date).format("DD/MM/YYYY"));
  };

  const formattedDates = formatPaymentDates(
    getTable.map((item) => item.payment_date)
  );

  useEffect(() => {
    const fetchEventFollowers = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_event_follower?event_id=${eventId}`
        );
        const eventFollowers = response.data;

        // Access the number of followers
        const followersCount = eventFollowers[0].number_of_follower;
        setNumberOfFollowers(followersCount);

        // Do something with the number of followers
      } catch (error) {
        console.error("Error fetching event followers:", error);
      }
    };

    // Call the function to fetch event followers
    fetchEventFollowers();
  }, []);

  return (
    <main>
      <div className="container mx-auto px-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            <h1 className=" text-2xl font-bold py-4">Event Dashboard</h1>
            <div className="border-2 border-[#060047] w-full h-[20rem] flex">
              <div className="align-middle items-center">
                <img
                  className="h-full w-[24rem] object-cover object-center"
                  src={eventData[0].poster}
                  alt="Your Image Alt Text"
                />
              </div>
              <div className="px-16 py-8 flex flex-col gap-4">
                <p className="text-[#E90064]">{eventTypeName.event_type}</p>
                <p className="font-bold text-2xl">{eventData[0].event_name}</p>
                <p className="font-medium">
                  {eventData && formatEventDate(eventData[0].event_startdate)} -{" "}
                  {eventData && formatEventDate(eventData[0].event_enddate)}
                </p>

                <p className="font-medium">@ {eventData[0].location}</p>
                <p>{eventData[0].event_description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full h-full mt-8 ">
              <div className="flex gap-6">
                <div className="text-4xl text-green-500">
                  <FaMoneyBill />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Earning</p>
                  <p className=" text-xl font-semibold">
                    <div>
                      {eventData2.map((event) => {
                        if (event.event_id === Number(eventId)) {
                          return (
                            <p key={event.event_id}>{event.total_sale} ฿</p>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-4xl text-red-500">
                  <FaMoneyBillWave />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Refund</p>
                  <p className=" text-xl font-semibold">
                    <div>
                      {eventData2.map((event) => {
                        if (event.event_id === Number(eventId)) {
                          return (
                            <p key={event.event_id}>{event.total_refund} ฿</p>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-4xl text-blue-500">
                  <FaMoneyCheckAlt />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className=" text-xl font-semibold">
                    <div>
                      {eventData2.map((event) => {
                        if (event.event_id === Number(eventId)) {
                          const calculatedValue =
                            event.total_sale - event.total_refund;
                          return (
                            <p key={event.event_id}>{calculatedValue} ฿</p>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full h-full py-8 ">
              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Total Followed</p>
                  <p className=" font-medium text-lg">{numberOfFollowers}</p>
                </div>
                <div className="flex  px-4 flex-col py-8"></div>
              </div>

              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Sex</p>
                </div>
                <div className="flex justify-center w-full">
                  <Pie
                    className="w-20 h-20 py-2"
                    data={chartData2}
                    options={chartOptions2}
                  />
                </div>
              </div>

              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Age</p>
                </div>

                <div className="flex justify-center w-full">
                  <Pie
                    className="w-20 h-20 py-2"
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
            <div>
              {" "}
              <p className=" text-lg py-2 px-2 font-semibold">Total Sale</p>
              <div className="flex justify-center">
                <div style={{ width: "800px" }}>
                  {getTable.length > 0 ? (
                    <Line
                      data={chartData3}
                      options={chartOptions3}
                      height={200}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <h1 className=" text-2xl font-bold py-4">Transaction</h1>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={getTable.map((transaction, index) => ({
                  id: index,
                  ...transaction,
                }))}
                columns={[
                  { field: "f_name", headerName: "First Name", flex: 1 },
                  { field: "l_name", headerName: "Last Name", flex: 1 },
                  { field: "price", headerName: "Price", flex: 1 },
                  {
                    field: "payment_date",
                    headerName: "Payment Date",
                    flex: 1,
                  },
                  {
                    field: "isrefund",
                    headerName: "Refund Status",
                    flex: 1,
                    valueGetter: (params) =>
                      params.row.isrefund ? "Refunded" : "Not Refunded",
                  },
                ]}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
            <div className="flex justify-between mt-1 py-4">
              <h1 className=" text-2xl font-bold">Seat Type</h1>
              <button
                className="px-2 py-2 rounded  bg-[#E90064] hover:bg-[#c60056e6] text-white font-medium text-base"
                onClick={openModal}
              >
                Add Seat Type
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
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Create Seat Type
                        </Dialog.Title>
                        <div className="mt-4">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                              <label
                                htmlFor="seat_type"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Seat Type Name
                              </label>
                              <TextField
                                id="seat_type"
                                name="seat_type"
                                type="text"
                                value={formData.seat_type}
                                onChange={handleChange}
                                required
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="price"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Price
                              </label>
                              <TextField
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="quantity_limit"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Quantity
                              </label>
                              <TextField
                                id="quantity_limit"
                                name="quantity_limit"
                                type="number"
                                value={formData.quantity_limit}
                                onChange={handleChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="sale_startdate"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Sale Start Date
                              </label>
                              <TextField
                                id="sale_startdate"
                                name="sale_startdate"
                                type="date"
                                value={formData.sale_startdate}
                                onChange={handleChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="sale_enddate"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Sale End Date
                              </label>
                              <TextField
                                id="sale_enddate"
                                name="sale_enddate"
                                type="date"
                                value={formData.sale_enddate}
                                onChange={handleChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="seat_type_description"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Description
                              </label>
                              <TextField
                                id="seat_type_description"
                                name="seat_type_description"
                                type="text"
                                value={formData.seat_type_description}
                                onChange={handleChange}
                                required
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mt-2">
                              <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-[#060047] hover:bg-[#c60056e6] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                              >
                                Add Seat Type
                              </button>
                            </div>
                          </form>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <Transition appear show={isSecondModalOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={closeSecondModal}
              >
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
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Seat Number
                        </Dialog.Title>
                        <div className="mt-4">
                          <form onSubmit={handleSubmitSecond}>
                            <div className="mb-4">
                              <label
                                htmlFor="seat_row"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Seat Row
                              </label>
                              <TextField
                                id="seat_row"
                                name="seat_row"
                                type="text"
                                value={secondFormData.seat_row}
                                onChange={handleChangeSecond}
                                required
                                fullWidth
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="seat_start"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Seat Start
                              </label>
                              <TextField
                                id="seat_start"
                                name="seat_start"
                                type="number"
                                value={secondFormData.seat_start}
                                onChange={handleChangeSecond}
                                required
                                fullWidth
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="seat_end"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Seat End
                              </label>
                              <TextField
                                id="seat_end"
                                name="seat_end"
                                type="number"
                                value={secondFormData.seat_end}
                                onChange={handleChangeSecond}
                                required
                                fullWidth
                                variant="outlined"
                              />
                            </div>

                            <div className="mt-2">
                              <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-[#060047] hover:bg-[#c60056e6] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                              >
                                Add Seat Number
                              </button>
                            </div>
                          </form>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <div className=" flex flex-col mb-4 gap-4">
              {seatTypes.length > 0 ? (
                seatTypes.map((seatType) => (
                  <div
                    key={seatType.seat_type_id}
                    className="w-full border-[1.5px] border-slate-300 rounded"
                  >
                    <div className="flex justify-between pt-4 px-4">
                      <h2 className="font-semibold text-xl">
                        {seatType.seat_type}
                      </h2>

                      <div className="flex gap-4 items-center">
                        <button
                          className="inline-flex justify-center rounded-md border border-transparent px-2 text-2xl font-semibold text-white bg-[#060047] hover:bg-[#c60056e6] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={() => openSecondModal(seatType)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-4 font-medium text-red-500">
                      Available until {formatEventDate(seatType.sale_enddate)}
                    </div>
                    <div className="px-4 pb-4 font-medium text-[#060047]">
                      Price: {seatType.price}
                    </div>
                  </div>
                ))
              ) : (
                <p className="flex justify-center">
                  Now Not have seat type. Please create one.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
