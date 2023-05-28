import { useState } from "react";

type Props = {
  img: string;
  eventName: string;
  location: string;
  eventDate: string;
};



const TABS = [
  { id: 1, label: "Active Tickets" },
  { id: 2, label: "Past Tickets" },
];

const ActiveTickets = ( {img, eventName, location, eventDate}: Props) => {
  return (
    <div className="flex flex-col w-full">
      <div className="border-2 border-[#060047] w-full h-50 flex">
        <div className="align-middle items-center">
          <img
            className="h-full w-36 object-cover object-center"
            src={img}
            alt="Your Image Alt Text"
          />
        </div>
        <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
          <p>{eventName}</p>
          <p className="font-medium text-sm">{location}</p>

          <p className="font-medium text-sm">Event Date: {eventDate}</p>
        </div>
        <div className="flex flex-col px-4 py-8 gap-4 ml-auto">
          <button className="bg-[#060047] text-sm  text-white font-semibold py-2 px-6 rounded-md">
            View Ticket
          </button>
          <button className=" border-[#060047] text-sm border-2 text-[#060047] font-semibold py-2 px-6 rounded-md">
            View Order Detail
          </button>
        </div>
      </div>
    </div>
  );
};

const PastTickets = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="border-2 border-[#060047] w-full h-50 flex">
        <div className="align-middle items-center">
          <img
            className="h-full w-36 object-cover object-center"
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Your Image Alt Text"
          />
        </div>
        <div className="px-4 text-lg py-8 font-semibold flex flex-col gap-4">
          <p>Global AI Bootcamp – Thailand</p>
          <p className="font-medium text-sm">Paid at Lorem Ipsum</p>

          <p className="font-medium text-sm">Event Date: Lorem Ipsum</p>
        </div>
        <div className="flex flex-col px-4 py-8 gap-4 ml-auto">
          <button className="bg-[#060047] text-sm  text-white font-semibold py-2 px-6 rounded-md">
            View Ticket
          </button>
          <button className=" border-[#060047] text-sm border-2 text-[#060047] font-semibold py-2 px-6 rounded-md">
            View Order Detail
          </button>
        </div>
      </div>
    </div>
  );
};

const TabBar = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS[0].id:
        return <ActiveTickets />;
      case TABS[1].id:
        return <PastTickets />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      <div className="flex space-x-4 py-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? "bg-[#060047] text-white font-medium"
                : "bg-gray-300"
            } px-4 py-2 font-medium rounded-md`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="">{renderTabContent()}</div>
    </div>
  );
};

export default TabBar;
