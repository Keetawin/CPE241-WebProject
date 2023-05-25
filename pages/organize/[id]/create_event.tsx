import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const event_type = [
  "Party",
  "Concert",
  "Mini Concert",
  "Festival",
  "Meet And Greet",
  "Run",
  "Bike",
  "Boxing",
  "Fitness",
  "Esports",
  "Tournament",
  "League",
  "Workshop",
  "Class",
  "Activation",
  "Press Conference",
  "Charity",
  "Networking",
  "Travel",
  "Photography",
  "Wedding",
  "Incentive",
  "Show",
  "Pageant",
  "Meetup",
  "Camp",
  "Conference",
  "Expo",
  "Exhibition",
  "Trade Fair",
  "Seminar",
  "Meetings",
  "Funding Raising",
  "Webinar",
  "Virtual Run",
  "Online Course",
  "Live Stream",
  "Online Expo",
];

const menuItems = event_type.map((type, index) => (
  <MenuItem key={index} value={index + 1}>
    {type}
  </MenuItem>
));

const names = [
  "Art & Design",
  "Beauty",
  "Book",
  "Business",
  "Charity",
  "Comedy",
  "Concert",
  "Education",
  "E-Sport",
  "Experience",
  "Fashion",
  "Finance & Accounting",
  "Food Delivery",
  "Food & Drink",
  "Games",
  "Health",
  "Hobbies & Special Interests",
  "Home & Furniture",
  "Job Fair",
  "Kids & Family",
  "Movies",
  "Music Festival",
  "Nightlife",
  "Party",
  "Performing Arts",
  "Real Estate",
  "Run",
  "Sales & Marketing",
  "School Activities",
  "Spirituality",
  "Sports",
  "Stage Plays",
  "Talk Show",
  "Technology",
  "Travel",
  "Vehicle",
];

export default function CreateEvent() {
  const theme = useTheme();
  const preSelectedValues: any[] = []; // Example array of pre-selected values
  const [age, setAge] = React.useState("");
  const [personName, setPersonName] = useState(preSelectedValues);
  const router = useRouter();
  const { id } = router.query;
  const [selectedValue, setSelectedValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the payload
    const payload = {
      organize_id: id, // Replace with the actual organize_id value
      categories_id: personName.map((index) => index + 1),
      event_name: event.target.name.value,
      event_startdate: event.target.start_date.value,
      event_enddate: event.target.end_date.value,
      location: event.target.location.value,
      event_type_id: age,
      event_description: event.target.message.value,
    };

    try {
      // Make the POST request to the API endpoint
      const response = await axios.post(
        "https://ticketapi.fly.dev/create_event",
        payload
      );

      console.log("Response:", response.data);
      // Handle success or display a success message
    } catch (error) {
      console.error("Error:", error);
      // Handle error or display an error message
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagAdd = (tag) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
  };

  const handleTagRemove = (tag) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-4">Create Events</h1>

        <div className="flex items-center justify-center">
          {/* Author: FormBold Team */}
          {/* Learn More: https://formbold.com */}
          <div className="mx-auto w-full max-w-[550px]">
            <form onSubmit={handleSubmit}>
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
                  className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="event_type"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Event Type
                </label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Event Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Event Type"
                    onChange={handleChangeSelect}
                  >
                    <MenuItem key={1} value={1}>
                      Party
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      Concert
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                      Mini Concert
                    </MenuItem>
                    <MenuItem key={4} value={4}>
                      Festival
                    </MenuItem>
                    <MenuItem key={5} value={5}>
                      Meet And Greet
                    </MenuItem>
                    <MenuItem key={6} value={6}>
                      Run
                    </MenuItem>
                    <MenuItem key={7} value={7}>
                      Bike
                    </MenuItem>
                    <MenuItem key={8} value={8}>
                      Boxing
                    </MenuItem>
                    <MenuItem key={9} value={9}>
                      Fitness
                    </MenuItem>
                    <MenuItem key={10} value={10}>
                      Esports
                    </MenuItem>
                    <MenuItem key={11} value={11}>
                      Tournament
                    </MenuItem>
                    <MenuItem key={12} value={12}>
                      League
                    </MenuItem>
                    <MenuItem key={13} value={13}>
                      Workshop
                    </MenuItem>
                    <MenuItem key={14} value={14}>
                      Class
                    </MenuItem>
                    <MenuItem key={15} value={15}>
                      Activation
                    </MenuItem>
                    <MenuItem key={16} value={16}>
                      Press Conference
                    </MenuItem>
                    <MenuItem key={17} value={17}>
                      Charity
                    </MenuItem>
                    <MenuItem key={18} value={18}>
                      Networking
                    </MenuItem>
                    <MenuItem key={19} value={19}>
                      Travel
                    </MenuItem>
                    <MenuItem key={20} value={20}>
                      Photography
                    </MenuItem>
                    <MenuItem key={21} value={21}>
                      Wedding
                    </MenuItem>
                    <MenuItem key={22} value={22}>
                      Incentive
                    </MenuItem>
                    <MenuItem key={23} value={23}>
                      Show
                    </MenuItem>
                    <MenuItem key={24} value={24}>
                      Pageant
                    </MenuItem>
                    <MenuItem key={25} value={25}>
                      Meetup
                    </MenuItem>
                    <MenuItem key={26} value={26}>
                      Camp
                    </MenuItem>
                    <MenuItem key={27} value={27}>
                      Conference
                    </MenuItem>
                    <MenuItem key={28} value={28}>
                      Expo
                    </MenuItem>
                    <MenuItem key={29} value={29}>
                      Exhibition
                    </MenuItem>
                    <MenuItem key={30} value={30}>
                      Trade Fair
                    </MenuItem>
                    <MenuItem key={31} value={31}>
                      Seminar
                    </MenuItem>
                    <MenuItem key={32} value={32}>
                      Meetings
                    </MenuItem>
                    <MenuItem key={33} value={33}>
                      Funding Raising
                    </MenuItem>
                    <MenuItem key={34} value={34}>
                      Webinar
                    </MenuItem>
                    <MenuItem key={35} value={35}>
                      Virtual Run
                    </MenuItem>
                    <MenuItem key={36} value={36}>
                      Online Course
                    </MenuItem>
                    <MenuItem key={37} value={37}>
                      Live Stream
                    </MenuItem>
                    <MenuItem key={38} value={38}>
                      Online Expo
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="mb-5">
                <label
                  htmlFor="categories"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Categories
                </label>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-chip-label">
                    Categories
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={names[value - 1]} /> // Assuming names array is zero-based
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {names.map(
                      (
                        name,
                        index // Assuming names array is zero-based
                      ) => (
                        <MenuItem
                          key={index + 1} // Incrementing ID
                          value={index + 1} // Incrementing ID
                        >
                          {name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="start_date"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  placeholder="Enter Your Location"
                  className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="end_date"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  placeholder="Enter Your Location"
                  className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                />
              </div>

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
                  className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
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
                  className="w-full resize-none rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                  defaultValue={""}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="hover:shadow-form rounded-md bg-[#060047] py-3 px-8 text-base font-semibold text-white outline-none"
                >
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
