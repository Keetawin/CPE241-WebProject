import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
  "Technology",
  "Art & Design",
  "Beauty",
  "Book",
  "Business",
  "Charity",
  "Comedy",
  "Concert",
  "Education",
  "E-Sport",
  "Fashion",
  "Finance & Accounting",
  "Food & Drink",
  "Food Delivery",
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
  "Travel",
  "Vehicle",
  "Experience",
];

export default function CreateEvent() {
  const [imageSrc, setImageSrc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadData, setUploadData] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const storageRef = getStorage(storage);
  const imagesListRef = ref(storageRef, "images/");

  const handleFileChange = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        const result = onLoadEvent.target?.result;
        if (typeof result === "string") {
          setImageSrc(result);
          setUploadData(null);
        }
      };

      reader.readAsDataURL(file);
    }
    setAcceptedFiles(files);
  }, []);

  const handleUpload = useCallback(async () => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const storageRef = getStorage(storage); // Update this line
      const imageName = `${file.name}_${uuidv4()}`;
      const fileRef = ref(storageRef, `images/${imageName}`);

      try {
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);

        setImageUrl(downloadUrl);
        setUploadData({ downloadUrl });
        setImageSrc(downloadUrl); // Set the newly uploaded image as the displayed image

        // TODO: Save the image URL to your database
        // Here, you can make an API request to your backend server
        // and pass the imageUrl to save it in your database
      } catch (error) {
        console.error(error);
      }
    }
  }, [acceptedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleFileChange,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const theme = useTheme();
  const preSelectedValues: any[] = []; // Example array of pre-selected values
  const [age, setAge] = React.useState("");
  const [personName, setPersonName] = useState(preSelectedValues);
  const router = useRouter();
  const { id } = router.query;
  const [selectedValue, setSelectedValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the payload
    const payload = {
      organize_id: Number(id), // Replace with the actual organize_id value
      categories_id: personName.map((index) => index + 1),
      event_name: eventName,
      event_startdate: startDate,
      event_enddate: endDate,
      location: location,
      event_type_id: age,
      event_description: eventDescription,
      poster: imageUrl,
    };

    try {
      // Make the POST request to the API endpoint
      const response = await axios.post(
        "https://ticketapi.fly.dev/create_event",
        payload
      );

      console.log("Response:", response.data);
      // Handle success or display a success message

      // Redirect to the desired URL
      router.push(`/organize/${id}`);
    } catch (error) {
      console.error("Error:", error);
      // Handle error or display an error message
      setErrorMessage("An error occurred. Please try again later.");
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
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="poster"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  Poster Upload
                </label>
              </div>

              <div>
                <section>
                  <div
                    {...getRootProps({
                      className:
                        "border-2 border-dashed rounded p-4 mb-4 cursor-pointer",
                    })}
                  >
                    <input {...getInputProps()} required />
                    <p className="text-gray-500">
                      Drag 'n' drop an image here, or click to select an image
                    </p>
                  </div>
                  <aside>
                    <ul>{files}</ul>
                  </aside>
                </section>

                {imageSrc && (
                  <div className="mt-4">
                    <img src={imageSrc} alt="Uploaded" className="max-w-full" />
                    {!uploadData && (
                      <button
                        className="bg-[#060047] text-white px-4 py-2 rounded my-4"
                        onClick={handleUpload}
                      >
                        Upload Image
                      </button>
                    )}
                  </div>
                )}
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
                    required
                  >
                    {event_type.map((type, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {type}
                      </MenuItem>
                    ))}
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
                    required
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    name="start_date"
                    id="start_date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                        required
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="end_date"
                  className="mb-3 block text-base font-medium text-[#060047]"
                >
                  End Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    id="end_date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="w-full rounded-md border border-gray-400 bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#060047] focus:shadow-md"
                        required
                      />
                    )}
                  />
                </LocalizationProvider>
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
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="hover:shadow-form rounded-md bg-[#060047] py-3 mb-4 px-8 text-base font-semibold text-white outline-none"
                  onClick={handleSubmit}
                >
                  Create Event
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
