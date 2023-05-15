import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const Account = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    f_name: session?.user?.first_name || "",
    l_name: session?.user?.last_name || "",
    email: session?.user?.email || "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send form data to API endpoint to update user info
      const response = await axios.put(
        `https://ticketapi.fly.dev/users/${session.user.id}`,
        formData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update user");
      }

      // Set submitted flag
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Account Settings</h1>
      {submitted && <p>Changes saved successfully!</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={formData.f_name}
            onChange={(e) =>
              setFormData({ ...formData, f_name: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            value={formData.l_name}
            onChange={(e) =>
              setFormData({ ...formData, l_name: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Account;
