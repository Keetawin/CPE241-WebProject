import { useState } from "react";

const TABS = [
  { id: 1, label: "Active Tickets" },
  { id: 2, label: "Past Tickets" },
];

const ActiveTickets = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="border-2 w-full h-48 flex">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div className="">4</div>
      </div>
    </div>
  );
};

const PastTickets = () => {
  return <h2>Past Tickets</h2>;
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
