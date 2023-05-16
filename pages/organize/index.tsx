import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import React from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import organize from "./organize_mock"; // Replace with your actual event data

export default function Organize() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-6">My Organize</h1>
        <div className="flex h-full">
          <div className="flex  flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div className="grid  grid-cols-3 gap-8 w-full h-full mx-10 ">
            {organize.map((event) => (
              <Link
                className="px-4 py-12 border border-gray-200 rounded-lg shadow bg-white hover:bg-slate-50"
                key={event.id}
                href={`/organize/${event.id}`}
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#060047]">
                  {event.title}
                </h5>
                <p className="text-gray-500">{event.eventCount} Events</p>
              </Link>
            ))}
            <button
              type="button"
              onClick={openModal}
              className=" px-4 py-12 font-medium text-[#060047] border border-gray-200 rounded-lg shadow hover:bg-slate-50 bg-white"
            >
              <h5 className="mb-2 flex justify-center text-4xl font-bold tracking-tight text-[#060047]">
                +
              </h5>
              Create Organize
            </button>

            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          Create Organize
                        </Dialog.Title>
                        <div className="mt-4">
                          <form>
                            <div className="mb-4">
                              {" "}
                              <label
                                htmlFor="judul"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Organize Name
                              </label>
                              <input
                                name="judul"
                                type="text"
                                className="
                                                w-full
                                                h-4
                                                sm:h-9
                                                border-b-2 border-gray-300
                                                focus:border-[#E90064]
                                                outline-none
                                            "
                              />
                            </div>

                            <div className="mb-4">
                              {" "}
                              <label
                                htmlFor="judul"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Telephone
                              </label>
                              <input
                                name="judul"
                                type="text"
                                className="
                                                w-full
                                                h-4
                                                sm:h-9
                                                border-b-2 border-gray-300
                                                focus:border-[#E90064]
                                                outline-none
                                            "
                              />
                            </div>
                            <div className="mb-4">
                              {" "}
                              <label
                                htmlFor="judul"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Website
                              </label>
                              <input
                                name="judul"
                                type="text"
                                className="
                                                w-full
                                                h-4
                                                sm:h-9
                                                border-b-2 border-gray-300
                                                focus:border-[#E90064]
                                                outline-none
                                            "
                              />
                            </div>
                          </form>
                        </div>

                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#060047] px-4 py-2 text-sm font-medium text-white hover:bg-[#E90064] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            Create Organize
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
    </main>
  );
}
