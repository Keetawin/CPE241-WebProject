import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import React from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import organize from "./organize_mock"; // Replace with your actual event data
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import {
  Alert,
  Checkbox,
  Collapse,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import PaymentSelect from "@/components/payment_select";

export default function Organize({ userOrganize, userPayment }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState("success");
  const [organizeData, setOrganizeData] = useState({
    name: "",
    telephone: "",
    website: "",
    payment_info_id: 0,
  });
  const censorValue = (value: string) => {
    const visibleDigits = 4; // Number of visible digits at the end
    const maskedValue =
      "*".repeat(value.length - visibleDigits) + value.slice(-visibleDigits);
    return maskedValue;
  };
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleInputChange = (e) => {
    setOrganizeData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateOrganize = async () => {
    const { name, telephone, website, payment_info_id } = organizeData;

    const organizeDataPayload = {
      user_id: session?.user?.user_id, // Use the user ID from the session
      name: name,
      tel: telephone,
      website: website,
      payment_info_id: payment_info_id,
    };

    try {
      const response = await axios
        .post("https://ticketapi.fly.dev/create_organize", organizeDataPayload)
        .then((res) => {
          if (res.status == 200) {
            setAlert("success");
          }
          if (res.status == 201) {
            setAlert("error");
          }
          setAlertMessage(res.data);
          setAlertOpen(true);
        });
      // closeModal();
      // Handle success response here
      console.log(response);
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };
  // console.log(session, userOrganize)

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
            {userOrganize.map((event) => (
              <Link
                className="px-4 py-12 border border-gray-200 rounded-lg shadow bg-white hover:bg-slate-50"
                key={event.organize_id}
                href={`/organize/${event.organize_id}`}
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#060047]">
                  {event.name}
                </h5>
                <p className="text-gray-500">Organization</p>
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
                              <label
                                htmlFor="name"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Organize Name
                              </label>
                              <TextField
                                id="name"
                                name="name"
                                value={organizeData.name}
                                type="text"
                                required
                                onChange={handleInputChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>

                            <div className="mb-4">
                              <label
                                htmlFor="telephone"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Telephone
                              </label>
                              <TextField
                                id="telephone"
                                name="telephone"
                                value={organizeData.telephone}
                                type="text"
                                onChange={handleInputChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="website"
                                className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                              >
                                Website
                              </label>
                              <TextField
                                id="website"
                                name="website"
                                value={organizeData.website}
                                type="text"
                                onChange={handleInputChange}
                                sx={{ width: "40ch" }}
                                variant="outlined"
                              />
                            </div>
                            <label
                              htmlFor="website"
                              className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                            >
                              Payment Method
                            </label>
                            <PaymentSelect
                              userPayment={userPayment}
                              required={true}
                              value={organizeData.payment_info_id}
                              onChange={(e: { target: { value: string } }) => {
                                setOrganizeData((prevData) => ({
                                  ...prevData,
                                  ["payment_info_id"]: e.target.value,
                                }));
                              }}
                            />
                            <Collapse in={alertOpen}>
                              <Alert
                                severity={alert}
                                action={
                                  <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                      setAlertOpen(false);
                                    }}
                                  >
                                    x
                                  </IconButton>
                                }
                                sx={{ mb: 2 }}
                              >
                                {alertMessage}
                              </Alert>
                            </Collapse>
                            <div className="mt-6 ">
                              <button
                                type="button"
                                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                  !organizeData.name ||
                                  !organizeData.payment_info_id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#060047] hover:bg-[#E90064]"
                                }`}
                                onClick={handleCreateOrganize}
                                disabled={
                                  !organizeData.name ||
                                  !organizeData.payment_info_id
                                }
                              >
                                Create Organize
                              </button>
                            </div>
                          </form>
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user_id = session?.user?.user_id;
  // console.log(user_id)

  try {
    const response1 = await axios.get(
      `https://ticketapi.fly.dev/get_user_organize?user_id=${user_id}`
    );
    const response2 = await axios.get(
      `https://ticketapi.fly.dev/get_user_payment?user_id=${user_id}`
    );
    const userOrganize = response1.data;
    const userPayment = response2.data;

    return {
      props: {
        userOrganize,
        userPayment,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        userOrganize: null, // or handle error case as desired
        userPayment: null,
      },
    };
  }
};
