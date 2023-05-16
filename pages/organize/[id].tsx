import { useRouter } from "next/router";
import organize from "./organize_mock"; // Replace with your actual event data

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
      <h1 className=" text-2xl font-bold py-6">{event.title} Dashboard</h1>
      <p>Date: {event.date}</p>
      <p>Description: {event.description}</p>
      {/* Render additional event details */}
    </div>
  );
}
