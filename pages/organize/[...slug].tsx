import React from "react";
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";

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
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-4">Event Dashboard</h1>
        <div className="border-2 border-[#060047] w-full h-72 flex">
          <div className="align-middle items-center">
            <img
              className="h-full w-[24rem] object-cover object-center"
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Your Image Alt Text"
            />
          </div>
          <div className="px-16 py-8 flex flex-col gap-4">
            <p className="text-[#E90064]">Event Type</p>
            <p className="font-bold text-2xl">Event Name</p>
            <p className="font-medium">Start Date - End Date</p>

            <p className="font-medium">Location</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
              animi pariatur ipsum provident quae perspiciatis, suscipit rerum
              dicta dolores amet ipsa at a sit et officiis beatae? Quidem,
              quisquam autem.
            </p>
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
        <div className="pb-8" style={{ height: 400, width: "100%" }}>
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
      </div>
    </main>
  );
}
