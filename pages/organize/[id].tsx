import { useRouter } from "next/router";
import organize from "./organize_mock"; // Replace with your actual event data
import { FaMoneyBill, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { id } = router.query;

  // Find the event object with the matching id
  const event = organize.find((event) => event.id === Number(id));

  if (!event) {
    // Handle case when event is not found
    return <div>Organize not found</div>;
  }

  return (
    <div className="container mx-auto px-10">
      <h1 className="text-2xl font-bold py-6">{event.title} Dashboard</h1>
      <div className="grid grid-cols-3 gap-8 w-full h-full mx-10 ">
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
      {/* Render additional event details */}
      <h1 className="text-2xl font-bold py-6">All Event</h1>
      <div className="grid grid-cols-3 gap-8 w-full h-full mx-10 ">
        <Link
          href={`/organize/${event.id}/create_event`}
          className="px-4 py-12 font-medium text-[#060047] border border-gray-200 rounded-lg shadow hover:bg-slate-50 bg-white"
        >
          <h5 className="mb-2 flex justify-center text-4xl font-bold tracking-tight text-[#060047]">
            +
          </h5>
          Create Event
        </Link>
      </div>
    </div>
  );
}
