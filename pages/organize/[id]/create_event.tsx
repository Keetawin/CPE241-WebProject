import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";

export default function CreateEvent() {
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-4">Create Events</h1>

        <div className="flex items-center justify-center">
          {/* Author: FormBold Team */}
          {/* Learn More: https://formbold.com */}
          <div className="mx-auto w-full max-w-[550px]">
            <form action="https://formbold.com/s/FORM_ID" method="POST">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Event Name"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="event_type"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Event Type
                </label>
                <select
                  name="event_type"
                  id="event_type_id"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                >
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              <div className="flex justify-between mb-5">Date Picker</div>

              <div className="mb-5">
                <label
                  htmlFor="location"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="Enter Your Location"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Enter your subject"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  id="message"
                  placeholder="Type your message"
                  className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                  defaultValue={""}
                />
              </div>
              <div>
                <button className="hover:shadow-form rounded-md bg-[#060047] py-3 px-8 text-base font-semibold text-white outline-none">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
