import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { createEvent } from "./api/create_event";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const eventData = {
        event_name: eventName,
        event_description: eventDescription,
        event_startdate: eventStartDate,
        event_enddate: eventEndDate,
        location: location,
        event_type_id: eventTypeId,
      };
      const response = await createEvent(eventData);
      router.push(`/events/${response.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Event Description:
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          Event Start Date:
          <input
            type="date"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Event End Date:
          <input
            type="date"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <br />
        <label>
          Event Type ID:
          <input
            type="text"
            value={eventTypeId}
            onChange={(e) => setEventTypeId(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
