import { useState, useEffect } from "react";
import EventCard from "@/components/event_card";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import CategorieSelect from "@/components/category_select";
import { GetServerSideProps } from "next";
import EventTypeSelect from "@/components/event_type_select";

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

export default function AllEventsPages({categories, event_type}) {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("")
  const [eventType, setEventType] = useState("")
  const [categoriesSearch, setCategoriesSearch] = useState<number[]>([])
  const query = router.query
  console.log(categoriesSearch)
  useEffect(() => {
    if(query.name){
      console.log("hello")
      setEventName(query.name.toString())
    }
  }, [query])
  

  useEffect(() => {
    let api = "https://ticketapi.fly.dev/get_event"
    let querys = []
    if(eventName && eventName.length !== 0 && eventName !== "null"){
      querys.push(`event_name=${eventName}`)
    }
    if(eventType && eventType.length !== 0 && eventType != "0"){
      querys.push(`event_type_id=${eventType}`)
    }
    if(categoriesSearch.length != 0){
      querys.push(`categories_id=[${categoriesSearch.join(', ')}]`)
    }
    if(querys.length !== 0){
      api = api+"?"+querys.join("&")
    }
    axios
      .get<Event[]>(api)
      .then((response) => {
        const sortedEvents = response.data.sort((a, b) =>
          dayjs(b.event_startdate).diff(a.event_startdate)
        );
        setEvents(sortedEvents);
        setLoading(false);
        // console.log(response);
      })
      .catch((error) => console.error(error));
  }, [eventName, categoriesSearch, eventType]);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMMM YYYY");
  };

  const displayedEvents = events.slice(0, 6); // Limit the number of displayed events to 6

  return (
    <main>
      <div className="px-10 pt-12">
        <h2 className="text-2xl font-semibold">Filter</h2>
        <div className="flex">
          <div className="flex flex-col mx-2">
            <label>Categories</label>
            <CategorieSelect
              sx={{width: "45ch", backgroundColor: "#ffffff"}}
              value={categoriesSearch}
              onChange={(e)=>{setCategoriesSearch(e.target.value)}}
              categories={categories}
              onDelete={
                (value: string) => {
                  setCategoriesSearch((current) => current.filter((item) => item !== value));
                }
              }
              />
          </div>
          <div className="flex flex-col mx-2">
            <label>Event Type</label>
            <EventTypeSelect
              sx={{width: "45ch", backgroundColor: "#ffffff"}}
              value={eventType}
              onChange={(e)=>{setEventType(e.target.value)}}
              eventType={event_type}
            />
          </div>
        </div>
      </div>
      <div className="px-10 py-8">
        <div className="card-list md:grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 flex flex-col gap-6 ">
          {displayedEvents && displayedEvents.length > 0 ? (
            displayedEvents.map((event) => (
              <Link
                href={{ pathname: "/events/[id]", query: { id: event.event_id } }}
                key={event.event_id}
              >
                <EventCard
                  eventDate={formatDate(event.event_startdate)}
                  img={event.poster}
                  eventName={event.event_name}
                  location={event.location}
                />
              </Link>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response1 = await axios.get("https://ticketapi.fly.dev/categories");
    const response2 = await axios.get("https://ticketapi.fly.dev/event_types");
    const categories = response1.data;
    const event_type = response2.data;
    return {
      props: {
        categories: categories,
        event_type: event_type
      },
    };
    
  } catch (error) {
    console.error(error);
    return {
      props: {
        categories: null,
        event_type: null
      },
    };
  }
};