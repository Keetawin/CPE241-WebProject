import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const CreateOrganization = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [tel, setTel] = useState("");
  const [website, setWebsite] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ticketapi.fly.dev/create_organize",
        {
          name: organizationName,
          tel: tel,
          website: website,
        }
      );
      router.push(`/organizations/${response.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-10">
      <h1 className=" text-2xl font-bold py-6">Create Organize</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Organization Name:
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Telephone:
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </label>
        <br />
        <label>
          Website:
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Organization</button>
      </form>
    </div>
  );
};

export default CreateOrganization;
