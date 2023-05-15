import axios from "axios";

// ส่งข้อมูลการสร้างกิจกรรมไปยังเซิร์ฟเวอร์ API
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(
      "https://ticketapi.fly.dev/create_event",
      eventData
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ส่งข้อมูลการสร้างองค์กรไปยังเซิร์ฟเวอร์ API
export const createOrganization = async (organizationData) => {
  try {
    const response = await axios.post(
      "https://ticketapi.fly.dev/create_organize",
      organizationData
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
