import React from "react";
import Link from "next/link";
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
                <svg
                  className="w-6 h-6 text-black transition duration-75 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span className="ml-3 text-black font-medium">Tickets</span>
              </Link>
            </li>

            <li>
              <Link
                href="/users/follow_event"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-slate-100"
              >
                <svg
                  className="flex-shrink-0 w-6 h-6 text-black transition duration-75 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg
                  className="flex-shrink-0 w-6 h-6 text-black transition duration-75 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg
                  className="flex-shrink-0 w-6 h-6 text-black transition duration-75 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                    clipRule="evenodd"
                  />
                </svg>
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
                <svg
                  className="flex-shrink-0 w-6 h-6 text-black transition duration-75 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                    clipRule="evenodd"
                  />
                </svg>
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
