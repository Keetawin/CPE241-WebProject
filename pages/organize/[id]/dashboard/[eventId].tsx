import React from "react";
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

// Register the necessary elements and scales
Chart.register(CategoryScale, LinearScale, BarElement);
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function EventDashBoard() {
  const router = useRouter();
  const { id, eventId } = router.query;
  const [eventData, setEventData] = useState(null);
  const [eventTypeName, setEventTypeName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

            <div className="grid grid-cols-3 gap-8 w-full h-full py-8 ">
              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Total Ticket</p>
                  <p className=" font-medium text-lg">Lorem</p>
                  <p>Percent</p>
                </div>
                <div>Graph</div>
              </div>

              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Total Follower</p>
                  <p className=" font-medium text-lg">Lorem</p>
                  <p>Percent</p>
                </div>
                <div>Graph</div>
              </div>

              <div className="w-full flex h-48 rounded-lg border-[1.5px] ">
                <div className="flex justify-center px-4 flex-col gap-6 ">
                  <p className=" text-lg font-semibold">Age</p>
                  <p className=" font-medium text-lg">Lorem</p>
                  <p>Percent</p>
                </div>
                <div>Graph</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full h-full ">
              <div className="flex gap-6">
                <div className="text-4xl text-green-500">
                  <FaMoneyBill />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Earning</p>
                  <p className=" text-xl font-semibold">Total</p>
                  <p className="text-sm">37.5 % this month</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-4xl text-red-500">
                  <FaMoneyBillWave />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Refund</p>
                  <p className=" text-xl font-semibold">Total</p>
                  <p className="text-sm">37.5 % this month</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-4xl text-blue-500">
                  <FaMoneyCheckAlt />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className=" text-xl font-semibold">Total</p>
                  <p className="text-sm">37.5 % this month</p>
                </div>
              </div>
            </div>
            <div className="py-8">
              <Bar data={data} options={options} />
            </div>

            <h1 className=" text-2xl font-bold py-4">Transaction</h1>
            <div className="" style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </div>
          </>
        )}

        <h1 className=" text-2xl font-bold py-4">Seat Type</h1>
        <div className=" flex flex-col mb-4 gap-4">
          <div className=" w-full border-[1.5px] border-slate-300 rounded">
            <div className="flex justify-between pt-4 px-4">
              <h2 className=" font-semibold text-xl">Name</h2>
              <div className="flex gap-4 items-center">
                <p className=" font-semibold text-xl">Seat Row</p>
              </div>
            </div>
            <div className="px-4 py-4 font-medium text-red-500">
              Available until ...
            </div>
            <div className="px-4 pb-4 font-medium  text-[#060047]">
              0 remaining
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
