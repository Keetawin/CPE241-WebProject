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
import { GetServerSideProps } from "next";
import EventTypeSelect from "@/components/event_type_select";
import CategorieSelect from "@/components/category_select";
import { Button } from "@mui/material";
import LocationTextField from "@/components/location_text_field";

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

export default function CreateEvent({ categories, event_type }) {
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
  const [eventType, setEventType] = React.useState("");
  const [categoriesSearch, setCategoriesSearch] = useState(preSelectedValues);
  const router = useRouter();
  const { id } = router.query;
  const [selectedValue, setSelectedValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the payload
    const payload = {
      organize_id: Number(id), // Replace with the actual organize_id value
      categories_id: categoriesSearch.map((index) => index + 1),
      event_name: eventName,
      event_startdate: startDate,
      event_enddate: endDate,
      location: location,
      event_type_id: eventType,
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

  const handleChange = (event: SelectChangeEvent<typeof categoriesSearch>) => {
    const {
      target: { value },
    } = event;
    setCategoriesSearch(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setEventType(event.target.value as string);
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
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className=" text-3xl font-bold text-[#060047] py-4">
            Create Events
          </h1>
          {/* Author: FormBold Team */}
          {/* Learn More: https://formbold.com */}
          <div className="mx-auto w-full max-w-[550px] my-5">
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
                        "border-2 border-dashed rounded p-4 mb-4 cursor-pointer bg-white h-24",
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
                  <EventTypeSelect
                    sx={{ backgroundColor: "#ffffff" }}
                    value={eventType}
                    onChange={handleChangeSelect}
                    eventType={event_type}
                  />
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
                  <CategorieSelect
                    sx={{ backgroundColor: "#ffffff" }}
                    value={categoriesSearch}
                    onChange={(e) => {
                      setCategoriesSearch(e.target.value);
                    }}
                    categories={categories}
                    onDelete={(value: string) => {
                      setCategoriesSearch((current) =>
                        current.filter((item) => item !== value)
                      );
                    }}
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
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
                      sx={{ backgroundColor: "#ffffff" }}
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
                      sx={{ backgroundColor: "#ffffff" }}
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
                <LocationTextField
                  onLocationSelect={(e) => {
                    setLocation(e);
                  }}
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
              <div className="flex">
                <Button
                  onClick={handleSubmit}
                  className="ml-auto"
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#E90064" }}
                >
                  Create Event
                </Button>
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response1 = await axios.get("https://ticketapi.fly.dev/categories");
    const response2 = await axios.get("https://ticketapi.fly.dev/event_types");
    const categories = response1.data;
    const event_type = response2.data;
    return {
      props: {
        categories: categories,
        event_type: event_type,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        categories: null,
        event_type: null,
      },
    };
  }
};
