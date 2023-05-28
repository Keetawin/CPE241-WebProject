import React from "react";
import Link from "next/link";
import {
  FaTicketAlt,
  FaStar,
  FaBuilding,
  FaUserCog,
  FaCreditCard,
} from "react-icons/fa";
const MenuBar = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <aside className="w-64 rounded-lg border-2 bg-white" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto rounded ">
          <ul className="space-y-2">
            <li>
              <Link
                href="/users/ticket"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <FaTicketAlt className="w-6 h-6 text-black transition duration-75 " />
                <span className="ml-3 text-black font-medium">Tickets</span>
              </Link>
            </li>

            <li>
              <Link
                href="/users/follow_event"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <FaStar className="flex-shrink-0 w-6 h-6 text-black transition duration-75 " />

                <span className="flex-1 ml-3 text-black font-medium whitespace-nowrap">
                  Follow Event
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/organize"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <FaBuilding className="flex-shrink-0 w-6 h-6 text-black transition duration-75 " />

                <span className="flex-1 ml-3 text-black font-medium whitespace-nowrap">
                  Organize
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/users/setting"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <FaUserCog className="flex-shrink-0 w-6 h-6 text-black transition duration-75 " />

                <span className="flex-1 ml-3 text-black font-medium whitespace-nowrap">
                  Settings
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/users/payment"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <FaCreditCard className="flex-shrink-0 w-6 h-6 text-black transition duration-75 " />

                <span className="flex-1 ml-3 text-black font-medium whitespace-nowrap">
                  Payment
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default MenuBar;
